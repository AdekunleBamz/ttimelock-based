// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/access/Ownable.sol";

contract LockOptions is Ownable {
    uint256 public minimumDeposit; // token smallest units (USDC = 6 decimals)

    mapping(uint64 => bool) public allowedDuration;
    uint64[] private durationList;

    event MinimumDepositSet(uint256 minimumDeposit);
    event DurationAllowed(uint64 duration, bool allowed);

    constructor(address initialOwner, uint256 _minimumDeposit) Ownable(initialOwner) {
        minimumDeposit = _minimumDeposit;
        emit MinimumDepositSet(_minimumDeposit);
    }

    function setMinimumDeposit(uint256 _minimumDeposit) external onlyOwner {
        minimumDeposit = _minimumDeposit;
        emit MinimumDepositSet(_minimumDeposit);
    }

    function setAllowedDuration(uint64 duration, bool allowed) external onlyOwner {
        if (allowed && !allowedDuration[duration]) {
            durationList.push(duration);
        }
        allowedDuration[duration] = allowed;
        emit DurationAllowed(duration, allowed);
    }

    function getDurations() external view returns (uint64[] memory) {
        return durationList;
    }

    function isAllowedDuration(uint64 duration) external view returns (bool) {
        return allowedDuration[duration];
    }
}
