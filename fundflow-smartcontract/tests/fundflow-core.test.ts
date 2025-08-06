import { describe, expect, it, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

describe('FundFlow Core Contract', () => {
  beforeEach(() => {
    // Reset simnet state before each test
  });

  describe('Platform Configuration', () => {
    it('should have correct initial platform fee (2.5%)', () => {
      const result = simnet.callReadOnlyFn(
        'fundflow-core',
        'get-platform-fee-percent',
        [],
        deployer
      );
      
      expect(result.result).toBeUint(250); // 2.5% = 250 basis points
    });

    it('should calculate platform fee correctly', () => {
      const amount = 1000000; // 1 STX in microSTX
      const result = simnet.callReadOnlyFn(
        'fundflow-core',
        'calculate-platform-fee',
        [Cl.uint(amount)],
        deployer
      );
      
      expect(result.result).toBeUint(25000); // 2.5% of 1 STX
    });

    it('should allow owner to update platform fee', () => {
      const newFee = 300; // 3%
      const result = simnet.callPublicFn(
        'fundflow-core',
        'set-platform-fee-percent',
        [Cl.uint(newFee)],
        deployer
      );
      
      expect(result.result).toBeOk(Cl.bool(true));
      
      // Verify the fee was updated
      const feeResult = simnet.callReadOnlyFn(
        'fundflow-core',
        'get-platform-fee-percent',
        [],
        deployer
      );
      expect(feeResult.result).toBeUint(newFee);
    });

    it('should reject platform fee update from non-owner', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'set-platform-fee-percent',
        [Cl.uint(300)],
        wallet1
      );
      
      expect(result.result).toBeErr(Cl.uint(1001)); // ERR_NOT_AUTHORIZED
    });

    it('should reject platform fee over 10%', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'set-platform-fee-percent',
        [Cl.uint(1100)], // 11%
        deployer
      );
      
      expect(result.result).toBeErr(Cl.uint(1006)); // ERR_INVALID_AMOUNT
    });
  });

  describe('Campaign Creation', () => {
    it('should create a campaign successfully', () => {
      const title = 'Test Campaign';
      const description = 'A test campaign for our startup';
      const targetAmount = 1000000000; // 1000 STX in microSTX
      const durationBlocks = 1000;

      const result = simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii(title),
          Cl.stringAscii(description),
          Cl.uint(targetAmount),
          Cl.uint(durationBlocks)
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(1)); // Campaign ID 1
    });

    it('should reject campaign with zero target amount', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Test'),
          Cl.stringAscii('Description'),
          Cl.uint(0),
          Cl.uint(1000)
        ],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(1006)); // ERR_INVALID_AMOUNT
    });

    it('should reject campaign with zero duration', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Test'),
          Cl.stringAscii('Description'),
          Cl.uint(1000000),
          Cl.uint(0)
        ],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(1006)); // ERR_INVALID_AMOUNT
    });

    it('should store campaign data correctly', () => {
      // Create campaign
      simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Test Campaign'),
          Cl.stringAscii('Test Description'),
          Cl.uint(1000000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      // Read campaign data
      const result = simnet.callReadOnlyFn(
        'fundflow-core',
        'get-campaign',
        [Cl.uint(1)],
        deployer
      );

      expect(result.result).toBeSome(
        Cl.tuple({
          creator: Cl.principal(wallet1),
          title: Cl.stringAscii('Test Campaign'),
          description: Cl.stringAscii('Test Description'),
          'target-amount': Cl.uint(1000000000),
          'raised-amount': Cl.uint(0),
          deadline: Cl.uint(simnet.blockHeight + 1000),
          'is-active': Cl.bool(true),
          'milestone-count': Cl.uint(0)
        })
      );
    });

    it('should increment campaign IDs correctly', () => {
      // Create first campaign
      const result1 = simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Campaign 1'),
          Cl.stringAscii('Description 1'),
          Cl.uint(1000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      // Create second campaign
      const result2 = simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Campaign 2'),
          Cl.stringAscii('Description 2'),
          Cl.uint(2000000),
          Cl.uint(1000)
        ],
        wallet2
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe('Investment Flow', () => {
    beforeEach(() => {
      // Create a test campaign before each investment test
      simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Investment Test Campaign'),
          Cl.stringAscii('Test campaign for investment'),
          Cl.uint(1000000000), // 1000 STX target
          Cl.uint(1000)
        ],
        wallet1
      );
    });

    it('should allow investment in active campaign', () => {
      const investmentAmount = 100000000; // 100 STX
      
      const result = simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(investmentAmount)],
        wallet2
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it('should record investment correctly', () => {
      const investmentAmount = 100000000; // 100 STX
      
      simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(investmentAmount)],
        wallet2
      );

      const result = simnet.callReadOnlyFn(
        'fundflow-core',
        'get-investment',
        [Cl.uint(1), Cl.principal(wallet2)],
        deployer
      );

      expect(result.result).toBeSome(
        Cl.tuple({
          amount: Cl.uint(97500000), // After 2.5% fee deduction
          timestamp: Cl.uint(simnet.blockHeight)
        })
      );
    });

    it('should reject investment in non-existent campaign', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(999), Cl.uint(100000000)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(1002)); // ERR_CAMPAIGN_NOT_FOUND
    });

    it('should reject zero investment', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(0)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(1006)); // ERR_INVALID_AMOUNT
    });

    it('should reject investment in expired campaign', () => {
      // Fast forward past campaign deadline
      simnet.mineEmptyBlocks(1001);

      const result = simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(100000000)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(1004)); // ERR_CAMPAIGN_ENDED
    });
  });

  describe('Milestone Management', () => {
    beforeEach(() => {
      // Create campaign and make investment
      simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Milestone Test Campaign'),
          Cl.stringAscii('Campaign for milestone testing'),
          Cl.uint(1000000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(100000000)], // 100 STX investment
        wallet2
      );
    });

    it('should allow campaign creator to add milestone', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'add-milestone',
        [
          Cl.uint(1),
          Cl.stringAscii('MVP Development'),
          Cl.stringAscii('Complete minimum viable product'),
          Cl.uint(50000000), // 50 STX
          Cl.uint(100) // 100 blocks voting period
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(0)); // Milestone ID 0
    });

    it('should reject milestone creation by non-creator', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'add-milestone',
        [
          Cl.uint(1),
          Cl.stringAscii('Unauthorized Milestone'),
          Cl.stringAscii('This should fail'),
          Cl.uint(50000000),
          Cl.uint(100)
        ],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(1001)); // ERR_NOT_AUTHORIZED
    });

    it('should store milestone data correctly', () => {
      simnet.callPublicFn(
        'fundflow-core',
        'add-milestone',
        [
          Cl.uint(1),
          Cl.stringAscii('MVP Development'),
          Cl.stringAscii('Complete MVP'),
          Cl.uint(50000000),
          Cl.uint(100)
        ],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        'fundflow-core',
        'get-milestone',
        [Cl.uint(1), Cl.uint(0)],
        deployer
      );

      expect(result.result).toBeSome(
        Cl.tuple({
          title: Cl.stringAscii('MVP Development'),
          description: Cl.stringAscii('Complete MVP'),
          'target-amount': Cl.uint(50000000),
          'is-completed': Cl.bool(false),
          'votes-for': Cl.uint(0),
          'votes-against': Cl.uint(0),
          'voting-deadline': Cl.uint(simnet.blockHeight + 100)
        })
      );
    });
  });

  describe('Milestone Voting', () => {
    beforeEach(() => {
      // Setup: Create campaign, invest, add milestone
      simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Voting Test Campaign'),
          Cl.stringAscii('Campaign for voting tests'),
          Cl.uint(1000000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      // Multiple investors with different amounts
      simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(100000000)], // 100 STX
        wallet2
      );

      simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(50000000)], // 50 STX
        wallet3
      );

      // Add milestone
      simnet.callPublicFn(
        'fundflow-core',
        'add-milestone',
        [
          Cl.uint(1),
          Cl.stringAscii('Test Milestone'),
          Cl.stringAscii('Milestone for voting'),
          Cl.uint(75000000), // 75 STX
          Cl.uint(100)
        ],
        wallet1
      );
    });

    it('should allow investors to vote on milestones', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'vote-on-milestone',
        [Cl.uint(1), Cl.uint(0), Cl.bool(true)], // Vote FOR
        wallet2
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it('should reject votes from non-investors', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'vote-on-milestone',
        [Cl.uint(1), Cl.uint(0), Cl.bool(true)],
        deployer // deployer never invested
      );

      expect(result.result).toBeErr(Cl.uint(1001)); // ERR_NOT_AUTHORIZED
    });

    it('should reject votes on non-existent milestone', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'vote-on-milestone',
        [Cl.uint(1), Cl.uint(999), Cl.bool(true)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(1005)); // ERR_MILESTONE_NOT_FOUND
    });

    it('should reject votes after voting deadline', () => {
      // Fast forward past voting deadline
      simnet.mineEmptyBlocks(101);

      const result = simnet.callPublicFn(
        'fundflow-core',
        'vote-on-milestone',
        [Cl.uint(1), Cl.uint(0), Cl.bool(true)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(1004)); // ERR_CAMPAIGN_ENDED
    });
  });

  describe('Fund Release', () => {
    beforeEach(() => {
      // Setup complete scenario
      simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Fund Release Test'),
          Cl.stringAscii('Testing fund release'),
          Cl.uint(1000000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(200000000)], // 200 STX
        wallet2
      );

      simnet.callPublicFn(
        'fundflow-core',
        'add-milestone',
        [
          Cl.uint(1),
          Cl.stringAscii('Release Test Milestone'),
          Cl.stringAscii('Test milestone for fund release'),
          Cl.uint(100000000), // 100 STX
          Cl.uint(100)
        ],
        wallet1
      );

      // Vote to approve milestone
      simnet.callPublicFn(
        'fundflow-core',
        'vote-on-milestone',
        [Cl.uint(1), Cl.uint(0), Cl.bool(true)],
        wallet2
      );

      // Fast forward past voting deadline
      simnet.mineEmptyBlocks(101);
    });

    it('should allow fund release for approved milestone', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'release-milestone-funds',
        [Cl.uint(1), Cl.uint(0)],
        wallet1
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it('should reject fund release by non-creator', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'release-milestone-funds',
        [Cl.uint(1), Cl.uint(0)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(1001)); // ERR_NOT_AUTHORIZED
    });
  });

  describe('Platform Fee Management', () => {
    beforeEach(() => {
      // Generate some platform fees
      simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Fee Test Campaign'),
          Cl.stringAscii('Generating fees'),
          Cl.uint(1000000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(100000000)], // 100 STX = 2.5 STX fee
        wallet2
      );
    });

    it('should allow owner to withdraw platform fees', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'withdraw-platform-fees',
        [Cl.principal(deployer)],
        deployer
      );

      expect(result.result).toBeOk(Cl.uint(2500000)); // 2.5 STX in microSTX
    });

    it('should reset platform fees to zero after withdrawal', () => {
      simnet.callPublicFn(
        'fundflow-core',
        'withdraw-platform-fees',
        [Cl.principal(deployer)],
        deployer
      );

      const result = simnet.callReadOnlyFn(
        'fundflow-core',
        'get-total-platform-fees',
        [],
        deployer
      );

      expect(result.result).toBeUint(0);
    });

    it('should reject fee withdrawal by non-owner', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'withdraw-platform-fees',
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(1001)); // ERR_NOT_AUTHORIZED
    });

    it('should reject withdrawal when no fees available', () => {
      // First withdraw all fees
      simnet.callPublicFn(
        'fundflow-core',
        'withdraw-platform-fees',
        [Cl.principal(deployer)],
        deployer
      );

      // Try to withdraw again
      const result = simnet.callPublicFn(
        'fundflow-core',
        'withdraw-platform-fees',
        [Cl.principal(deployer)],
        deployer
      );

      expect(result.result).toBeErr(Cl.uint(1003)); // ERR_INSUFFICIENT_FUNDS
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle maximum values correctly', () => {
      // This should work with large values
      const result = simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Max Value Campaign'),
          Cl.stringAscii('Testing maximum values'),
          Cl.uint(Number.MAX_SAFE_INTEGER),
          Cl.uint(1000)
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(1));
    });

    it('should handle empty strings in campaign creation', () => {
      const result = simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii(''),
          Cl.stringAscii(''),
          Cl.uint(1000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(1));
    });

    it('should handle multiple simultaneous operations', () => {
      // Create campaign
      simnet.callPublicFn(
        'fundflow-core',
        'create-campaign',
        [
          Cl.stringAscii('Concurrent Test'),
          Cl.stringAscii('Testing concurrent operations'),
          Cl.uint(1000000000),
          Cl.uint(1000)
        ],
        wallet1
      );

      // Multiple investors investing simultaneously
      const results = [];
      results.push(simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(50000000)],
        wallet2
      ));

      results.push(simnet.callPublicFn(
        'fundflow-core',
        'invest-in-campaign',
        [Cl.uint(1), Cl.uint(30000000)],
        wallet3
      ));

      results.forEach(result => {
        expect(result.result).toBeOk(Cl.bool(true));
      });
    });
  });
});