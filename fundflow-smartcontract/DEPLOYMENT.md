# FundFlow Smart Contract Deployment Guide

## Prerequisites ✅
- [x] Clarinet CLI installed (v2.16.0)
- [x] Stacks CLI installed 
- [x] Smart contract tested (31 tests passing)
- [x] Testnet wallet created
- [x] Environment configuration set up

## Deployment Information

### Testnet Wallet
- **Address:** `ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV`
- **Network:** Stacks Testnet
- **Faucet:** https://explorer.stacks.co/sandbox/faucet

### Contract Details
- **Name:** `fundflow-core`
- **File:** `contracts/fundflow-core.clar`
- **Features:** Milestone-based fundraising, STX investments, community voting
- **Platform Fee:** 2.5% (250 basis points)

## Deployment Steps

### 1. Get Testnet STX
```bash
# Option 1: Web faucet (recommended)
# Visit: https://explorer.stacks.co/sandbox/faucet
# Enter: ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV

# Option 2: CLI faucet
stx faucet ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV -t

# Check balance
stx balance ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV -t
```

### 2. Deploy Contract
```bash
# Automated deployment
./deploy.sh

# Or manual deployment
clarinet deploy --testnet
```

### 3. Verify Deployment
After deployment, you'll get:
- **Transaction ID:** Use to track deployment status
- **Contract Address:** Your wallet address + contract name
- **Explorer Link:** View on Stacks Explorer

### 4. Update Frontend Configuration
Update `.env.local` with deployed contract address:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV
NEXT_PUBLIC_CONTRACT_NAME=fundflow-core
```

## Testing Deployment

### Read-Only Functions
```bash
# Check platform fee
clarinet call-read-only fundflow-core get-platform-fee-percent ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV

# Get next campaign ID
clarinet call-read-only fundflow-core get-next-campaign-id ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV
```

### Create Test Campaign
```bash
clarinet call fundflow-core create-campaign \
  '"Test Campaign"' \
  '"My first campaign"' \
  u1000000000 \
  u1000 \
  --testnet
```

## Troubleshooting

### Common Issues
1. **Insufficient Balance:** Get more testnet STX from faucet
2. **Network Issues:** Wait and retry, testnet can be slow
3. **Contract Exists:** Use different contract name or address

### Useful Commands
```bash
# Check network status
stx get_account_at ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV -t

# View transaction
stx get_transaction_info <TX_ID> -t

# List account transactions
stx get_account_history ST30QTTQ7DTA5759EFX5VXMV7GD46Y07QCRAVYV 0 -t
```

## Next Steps After Deployment

1. **Update Frontend:** Configure contract address in environment
2. **Test Integration:** Create campaigns and investments through UI
3. **Monitor Metrics:** Track platform usage and fees
4. **Consider Mainnet:** Deploy to mainnet when ready for production

## Security Notes

- ⚠️ This is TESTNET ONLY - never use these keys on mainnet
- 🔒 Store mnemonic phrase securely
- 🚫 Never commit private keys to version control
- ✅ Test thoroughly before mainnet deployment