;; FundFlow Core Smart Contract
;; A decentralized fundraising platform for startups

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u1001))
(define-constant ERR_CAMPAIGN_NOT_FOUND (err u1002))
(define-constant ERR_INSUFFICIENT_FUNDS (err u1003))
(define-constant ERR_CAMPAIGN_ENDED (err u1004))
(define-constant ERR_MILESTONE_NOT_FOUND (err u1005))
(define-constant ERR_INVALID_AMOUNT (err u1006))
(define-constant ERR_CAMPAIGN_ALREADY_EXISTS (err u1007))

;; Data Variables
(define-data-var platform-fee-percent uint u250) ;; 2.5% = 250 basis points
(define-data-var total-platform-fees uint u0)

;; Data Maps
(define-map campaigns
    { campaign-id: uint }
    {
        creator: principal,
        title: (string-ascii 256),
        description: (string-ascii 1024),
        target-amount: uint,
        raised-amount: uint,
        deadline: uint,
        is-active: bool,
        milestone-count: uint
    }
)

(define-map milestones
    { campaign-id: uint, milestone-id: uint }
    {
        title: (string-ascii 256),
        description: (string-ascii 512),
        target-amount: uint,
        is-completed: bool,
        votes-for: uint,
        votes-against: uint,
        voting-deadline: uint
    }
)

(define-map investments
    { campaign-id: uint, investor: principal }
    { amount: uint, timestamp: uint }
)

(define-map campaign-investments
    { campaign-id: uint }
    { total-investors: uint, total-amount: uint }
)

(define-map milestone-votes
    { campaign-id: uint, milestone-id: uint, voter: principal }
    { vote: bool, voting-power: uint }
)

;; Data Variables for IDs
(define-data-var next-campaign-id uint u1)

;; Read-only functions
(define-read-only (get-campaign (campaign-id uint))
    (map-get? campaigns { campaign-id: campaign-id })
)

(define-read-only (get-milestone (campaign-id uint) (milestone-id uint))
    (map-get? milestones { campaign-id: campaign-id, milestone-id: milestone-id })
)

(define-read-only (get-investment (campaign-id uint) (investor principal))
    (map-get? investments { campaign-id: campaign-id, investor: investor })
)

(define-read-only (get-platform-fee-percent)
    (var-get platform-fee-percent)
)

(define-read-only (get-total-platform-fees)
    (var-get total-platform-fees)
)

(define-read-only (calculate-platform-fee (amount uint))
    (/ (* amount (var-get platform-fee-percent)) u10000)
)

;; Public functions

;; Create a new campaign
(define-public (create-campaign 
    (title (string-ascii 256))
    (description (string-ascii 1024))
    (target-amount uint)
    (duration-blocks uint))
    (let ((campaign-id (var-get next-campaign-id))
          (deadline (+ block-height duration-blocks)))
        (asserts! (> target-amount u0) ERR_INVALID_AMOUNT)
        (asserts! (> duration-blocks u0) ERR_INVALID_AMOUNT)
        
        (map-set campaigns
            { campaign-id: campaign-id }
            {
                creator: tx-sender,
                title: title,
                description: description,
                target-amount: target-amount,
                raised-amount: u0,
                deadline: deadline,
                is-active: true,
                milestone-count: u0
            }
        )
        
        (map-set campaign-investments
            { campaign-id: campaign-id }
            { total-investors: u0, total-amount: u0 }
        )
        
        (var-set next-campaign-id (+ campaign-id u1))
        (ok campaign-id)
    )
)

;; Invest in a campaign
(define-public (invest-in-campaign (campaign-id uint) (amount uint))
    (let ((campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND))
          (existing-investment (default-to { amount: u0, timestamp: u0 } 
                               (get-investment campaign-id tx-sender)))
          (platform-fee (calculate-platform-fee amount))
          (net-investment (- amount platform-fee)))
        
        (asserts! (get is-active campaign) ERR_CAMPAIGN_ENDED)
        (asserts! (< block-height (get deadline campaign)) ERR_CAMPAIGN_ENDED)
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        
        ;; Transfer STX from investor to contract
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        
        ;; Update investment record
        (map-set investments
            { campaign-id: campaign-id, investor: tx-sender }
            {
                amount: (+ (get amount existing-investment) net-investment),
                timestamp: block-height
            }
        )
        
        ;; Update campaign totals
        (map-set campaigns
            { campaign-id: campaign-id }
            (merge campaign { raised-amount: (+ (get raised-amount campaign) net-investment) })
        )
        
        ;; Update platform fees
        (var-set total-platform-fees (+ (var-get total-platform-fees) platform-fee))
        
        (ok true)
    )
)

;; Add milestone to campaign
(define-public (add-milestone
    (campaign-id uint)
    (title (string-ascii 256))
    (description (string-ascii 512))
    (target-amount uint)
    (voting-duration-blocks uint))
    (let ((campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND))
          (milestone-id (get milestone-count campaign))
          (voting-deadline (+ block-height voting-duration-blocks)))
        
        (asserts! (is-eq tx-sender (get creator campaign)) ERR_NOT_AUTHORIZED)
        (asserts! (> target-amount u0) ERR_INVALID_AMOUNT)
        
        (map-set milestones
            { campaign-id: campaign-id, milestone-id: milestone-id }
            {
                title: title,
                description: description,
                target-amount: target-amount,
                is-completed: false,
                votes-for: u0,
                votes-against: u0,
                voting-deadline: voting-deadline
            }
        )
        
        (map-set campaigns
            { campaign-id: campaign-id }
            (merge campaign { milestone-count: (+ milestone-id u1) })
        )
        
        (ok milestone-id)
    )
)

;; Vote on milestone
(define-public (vote-on-milestone
    (campaign-id uint)
    (milestone-id uint)
    (vote-for bool))
    (let ((milestone (unwrap! (get-milestone campaign-id milestone-id) ERR_MILESTONE_NOT_FOUND))
          (investment (unwrap! (get-investment campaign-id tx-sender) ERR_NOT_AUTHORIZED))
          (voting-power (get amount investment)))
        
        (asserts! (< block-height (get voting-deadline milestone)) ERR_CAMPAIGN_ENDED)
        (asserts! (> voting-power u0) ERR_NOT_AUTHORIZED)
        
        ;; Record vote
        (map-set milestone-votes
            { campaign-id: campaign-id, milestone-id: milestone-id, voter: tx-sender }
            { vote: vote-for, voting-power: voting-power }
        )
        
        ;; Update milestone vote counts
        (if vote-for
            (map-set milestones
                { campaign-id: campaign-id, milestone-id: milestone-id }
                (merge milestone { votes-for: (+ (get votes-for milestone) voting-power) })
            )
            (map-set milestones
                { campaign-id: campaign-id, milestone-id: milestone-id }
                (merge milestone { votes-against: (+ (get votes-against milestone) voting-power) })
            )
        )
        
        (ok true)
    )
)

;; Release milestone funds (if approved)
(define-public (release-milestone-funds (campaign-id uint) (milestone-id uint))
    (let ((campaign (unwrap! (get-campaign campaign-id) ERR_CAMPAIGN_NOT_FOUND))
          (milestone (unwrap! (get-milestone campaign-id milestone-id) ERR_MILESTONE_NOT_FOUND)))
        
        (asserts! (is-eq tx-sender (get creator campaign)) ERR_NOT_AUTHORIZED)
        (asserts! (> (get votes-for milestone) (get votes-against milestone)) ERR_NOT_AUTHORIZED)
        (asserts! (>= block-height (get voting-deadline milestone)) ERR_CAMPAIGN_ENDED)
        
        ;; Transfer milestone funds to campaign creator
        (try! (as-contract (stx-transfer? (get target-amount milestone) tx-sender (get creator campaign))))
        
        ;; Mark milestone as completed
        (map-set milestones
            { campaign-id: campaign-id, milestone-id: milestone-id }
            (merge milestone { is-completed: true })
        )
        
        (ok true)
    )
)

;; Admin function to withdraw platform fees
(define-public (withdraw-platform-fees (recipient principal))
    (let ((fees (var-get total-platform-fees)))
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
        (asserts! (> fees u0) ERR_INSUFFICIENT_FUNDS)
        
        (try! (as-contract (stx-transfer? fees tx-sender recipient)))
        (var-set total-platform-fees u0)
        
        (ok fees)
    )
)

;; Admin function to update platform fee
(define-public (set-platform-fee-percent (new-fee uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
        (asserts! (<= new-fee u1000) ERR_INVALID_AMOUNT) ;; Max 10%
        (var-set platform-fee-percent new-fee)
        (ok true)
    )
)