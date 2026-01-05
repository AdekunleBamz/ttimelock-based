// LockOptions ABI
export const LOCK_OPTIONS_ABI = [
  "function minimumDeposit() external view returns (uint256)",
  "function isAllowedDuration(uint64 duration) external view returns (bool)",
  "function getDurations() external view returns (uint64[])",
];
