// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/utils/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC20/utils/SafeERC20.sol";

interface ILockOptions {
    function minimumDeposit() external view returns (uint256);
    function isAllowedDuration(uint64 duration) external view returns (bool);
}

contract TimelockVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint16 public constant DEPOSIT_FEE_BPS = 50;     // 0.5%
    uint16 public constant EMERGENCY_FEE_BPS = 1000; // 10%
    uint16 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable token; // USDC
    ILockOptions public immutable lockOptions;
    address public immutable treasury;

    address public router; // set once after deploy

    struct Deposit {
        address owner;
        uint256 principal;   // net of deposit fee
        uint64 startTime;
        uint64 unlockTime;
        bool withdrawn;
    }

    uint256 public nextDepositId = 1;
    mapping(uint256 => Deposit) public deposits;

    event RouterSet(address router);
    event Deposited(
        uint256 indexed depositId,
        address indexed owner,
        uint256 grossAmount,
        uint256 feeAmount,
        uint256 principal,
        uint64 unlockTime
    );
    event Withdrawn(uint256 indexed depositId, address indexed owner, uint256 amount);
    event EmergencyWithdrawn(uint256 indexed depositId, address indexed owner, uint256 payout, uint256 penalty);

    error NotRouter();
    error RouterAlreadySet();

    modifier onlyRouter() {
        if (msg.sender != router) revert NotRouter();
        _;
    }

    constructor(
        address initialOwner,
        address _token,
        address _lockOptions,
        address _treasury
    ) Ownable(initialOwner) {
        require(_token != address(0) && _lockOptions != address(0) && _treasury != address(0), "bad addr");
        token = IERC20(_token);
        lockOptions = ILockOptions(_lockOptions);
        treasury = _treasury;
    }

    function setRouter(address _router) external onlyOwner {
        if (router != address(0)) revert RouterAlreadySet();
        require(_router != address(0), "bad router");
        router = _router;
        emit RouterSet(_router);
    }

    // Router calls this AFTER transferring funds:
    // - fee -> treasury
    // - principal -> vault
    function registerDeposit(
        address owner_,
        uint256 grossAmount,
        uint256 principal,
        uint64 duration
    ) external onlyRouter nonReentrant returns (uint256 depositId) {
        require(owner_ != address(0), "bad owner");
        require(lockOptions.isAllowedDuration(duration), "duration not allowed");
        require(grossAmount >= lockOptions.minimumDeposit(), "below minimum");

        uint256 fee = (grossAmount * DEPOSIT_FEE_BPS) / BPS_DENOMINATOR;
        require(principal == grossAmount - fee, "principal mismatch");
        require(principal > 0, "zero principal");

        depositId = nextDepositId++;
        uint64 nowTs = uint64(block.timestamp);

        deposits[depositId] = Deposit({
            owner: owner_,
            principal: principal,
            startTime: nowTs,
            unlockTime: nowTs + duration,
            withdrawn: false
        });

        emit Deposited(depositId, owner_, grossAmount, fee, principal, nowTs + duration);
    }

    function withdraw(uint256 depositId) external nonReentrant {
        Deposit storage d = deposits[depositId];
        require(d.owner == msg.sender, "not owner");
        require(!d.withdrawn, "already withdrawn");
        require(block.timestamp >= d.unlockTime, "still locked");

        d.withdrawn = true;
        token.safeTransfer(msg.sender, d.principal);
        emit Withdrawn(depositId, msg.sender, d.principal);
    }

    function emergencyWithdraw(uint256 depositId) external nonReentrant {
        Deposit storage d = deposits[depositId];
        require(d.owner == msg.sender, "not owner");
        require(!d.withdrawn, "already withdrawn");

        d.withdrawn = true;

        uint256 penalty = (d.principal * EMERGENCY_FEE_BPS) / BPS_DENOMINATOR;
        uint256 payout = d.principal - penalty;

        if (penalty > 0) token.safeTransfer(treasury, penalty);
        token.safeTransfer(msg.sender, payout);

        emit EmergencyWithdrawn(depositId, msg.sender, payout, penalty);
    }
}
