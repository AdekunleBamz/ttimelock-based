// TimelockVault ABI
export const TIMELOCK_VAULT_ABI = [
  "function nextDepositId() external view returns (uint256)",
  "function deposits(uint256 depositId) external view returns (address owner, uint256 principal, uint64 startTime, uint64 unlockTime, bool withdrawn)",
  "function withdraw(uint256 depositId) external",
  "function emergencyWithdraw(uint256 depositId) external",
  "event Deposited(uint256 indexed depositId, address indexed owner, uint256 grossAmount, uint256 feeAmount, uint256 principal, uint64 unlockTime)",
  "event Withdrawn(uint256 indexed depositId, address indexed owner, uint256 amount)",
  "event EmergencyWithdrawn(uint256 indexed depositId, address indexed owner, uint256 payout, uint256 penalty)",
];
