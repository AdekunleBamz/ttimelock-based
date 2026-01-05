// VaultRouter ABI
export const VAULT_ROUTER_ABI = [
  "function deposit(uint256 grossAmount, uint64 duration) external returns (uint256 depositId)",
  "function withdraw(uint256 depositId) external",
  "function emergencyWithdraw(uint256 depositId) external",
  "event DepositRouted(address indexed user, uint256 indexed depositId, uint256 grossAmount, uint256 feeAmount, uint256 principal, uint64 duration)",
];
