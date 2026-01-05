// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC20/utils/SafeERC20.sol";

interface ITimelockVault {
    function registerDeposit(address owner_, uint256 grossAmount, uint256 principal, uint64 duration)
        external
        returns (uint256 depositId);

    function withdraw(uint256 depositId) external;
    function emergencyWithdraw(uint256 depositId) external;
}

interface ILockOptions {
    function minimumDeposit() external view returns (uint256);
    function isAllowedDuration(uint64 duration) external view returns (bool);
}

contract VaultRouter is Ownable {
    using SafeERC20 for IERC20;

    uint16 public constant DEPOSIT_FEE_BPS = 50; // 0.5%
    uint16 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable token; // USDC
    ITimelockVault public immutable vault;
    ILockOptions public immutable lockOptions;
    address public immutable treasury;

    event DepositRouted(
        address indexed user,
        uint256 indexed depositId,
        uint256 grossAmount,
        uint256 feeAmount,
        uint256 principal,
        uint64 duration
    );

    constructor(
        address initialOwner,
        address _token,
        address _vault,
        address _lockOptions,
        address _treasury
    ) Ownable(initialOwner) {
        require(_token != address(0) && _vault != address(0) && _lockOptions != address(0) && _treasury != address(0), "bad addr");
        token = IERC20(_token);
        vault = ITimelockVault(_vault);
        lockOptions = ILockOptions(_lockOptions);
        treasury = _treasury;
    }

    function deposit(uint256 grossAmount, uint64 duration) external returns (uint256 depositId) {
        require(lockOptions.isAllowedDuration(duration), "duration not allowed");
        require(grossAmount >= lockOptions.minimumDeposit(), "below minimum");

        uint256 fee = (grossAmount * DEPOSIT_FEE_BPS) / BPS_DENOMINATOR;
        uint256 principal = grossAmount - fee;

        // Pull from user: fee -> treasury, principal -> vault
        if (fee > 0) token.safeTransferFrom(msg.sender, treasury, fee);
        token.safeTransferFrom(msg.sender, address(vault), principal);

        depositId = vault.registerDeposit(msg.sender, grossAmount, principal, duration);

        emit DepositRouted(msg.sender, depositId, grossAmount, fee, principal, duration);
    }

    function withdraw(uint256 depositId) external {
        vault.withdraw(depositId);
    }

    function emergencyWithdraw(uint256 depositId) external {
        vault.emergencyWithdraw(depositId);
    }
}
