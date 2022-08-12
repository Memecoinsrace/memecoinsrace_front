use anchor_lang::prelude::*;
use anchor_spl::token::{
    self, 
    //CloseAccount, 
    Mint, 
    SetAuthority,
    TokenAccount,
    Transfer,
    Token,
    };
use spl_token::instruction::AuthorityType;
use std::str::FromStr;

use chainlink_solana as chainlink;

declare_id!("3hiTKYS4bVHgZbkr8sexTzp62tkxS4bufcMNJfgEtVfK");  

#[program]
pub mod mcr_contract {
    use super::*;
    
    const ESCROW_PDA_SEED: &[u8] = b"betEscrow";
    const WITHDRAWAL_ACCOUNT: &str = "GqqF2ZnhbTDNM6DaTpUeQTZVy2ShfLMDeWb6yM4hQWzM";
	const WITHDRAWAL_SOL_ACCOUNT: &str = "GqqF2ZnhbTDNM6DaTpUeQTZVy2ShfLMDeWb6yM4hQWzM";
    
    pub fn initialize(
        ctx: Context<Initialize>,        
    ) -> Result<()> {        

        let (vault_authority, _vault_authority_bump) =
            Pubkey::find_program_address(&[ESCROW_PDA_SEED], ctx.program_id);
            
        msg!("Founded authority {}",
            vault_authority);

        token::set_authority(
            ctx.accounts.into_set_authority_context(),
            AuthorityType::AccountOwner,
            Some(vault_authority),
        )?;        

        Ok(())
    }
    
    pub fn initialize_sol(
        _ctx: Context<InitializeSol>,        
    ) -> Result<()> {        

        msg!("Initializing vault lamports account");

        Ok(())
    }
    
    /*
    pub fn show_dia( 
        ctx: Context<ShowDia>,
           
        ) -> Result<()>   {
            msg!("DIA price: {}", ctx.accounts.coin_info.price);
            msg!("DIA symbol: {}", ctx.accounts.coin_info.symbol);
            
            Ok(())
        
        }
*/

    pub fn execute( 
        ctx: Context<Execute>,        
        bet_amount: u64,
        bet_on_result: u64,   
        ) -> Result<()>   {               
        
        //Check that bet amount betwen 100 and 100000 tokens
        require!(bet_amount <= 100000, MyError::DataTooLarge);
        require!(bet_amount >= 100, MyError::DataTooSmall);
        
        msg!("Amount of tokens user have on account {}",
            ctx.accounts.user_deposit_token_account.amount);
            
        //Check that user have enouph tokens for the bet
        require!(ctx.accounts.user_deposit_token_account.amount >= bet_amount, MyError::InsuficientUserFunds);
        
        msg!("Token balance of escrow treasury {}",
            ctx.accounts.treasury_account.amount);        
            
        //Check the tresure have enouph tokens to return equal result bet        
        require!(ctx.accounts.treasury_account.amount > bet_amount*10,       MyError::InsuficientTreasury);
        
        //Save bet amount into escrow account
        ctx.accounts.escrow_account.bet_amount = bet_amount;
        
        //Save user authority for the bet result
        ctx.accounts.escrow_account.better_account = *ctx.accounts.user_deposit_token_account.to_account_info().key;
        
        //Transfer user's tokens to treasury acoount
        token::transfer(
            ctx.accounts.into_transfer_to_pda_context(),
            ctx.accounts.escrow_account.bet_amount,
        )?;
        
        //Query chainlink for price information
        let round = chainlink::latest_round_data(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;
        
        
        let description = chainlink::description(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;

        let decimals = chainlink::decimals(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;

        // Save the price in escrow account        
        ctx.accounts.escrow_account.value=round.answer;
        ctx.accounts.escrow_account.decimals=u32::from(decimals);
        
        //Save bet on result in escrow account
        ctx.accounts.escrow_account.bet_on_result=bet_on_result;
        
        //Save betted coin pair id in escrow account
        ctx.accounts.escrow_account.pair_name = 
            *ctx.accounts.chainlink_feed.to_account_info().key;
            
        //Initialize escrow as active
        ctx.accounts.escrow_account.active = true; 
        //create winning field
        ctx.accounts.escrow_account.user_wins = false;         

        
        msg!("{} price is {}", description, round.answer);
        msg!("User betted  {} tokens for:", bet_amount);
        //Check bet on result
        match bet_on_result {
            0 => msg!("bet result suspended to be Rise"),
            1 => msg!("bet result suspended to be Equal"),
            2 => msg!("bet result suspended to be Decrease"),
            _ => return Err(error!(MyError::WrongBetOnResult)),
        
        }        
        
        Ok(())
    }


    pub fn make_bet_sol( 
        ctx: Context<MakeBetSol>,        
        sol_bet_amount: u64,
        bet_on_result: u64,  
        time_to_lock: i64, 
        ) -> Result<()>   {        
        
        
        //Check that bet amount betwen 100 and 100000 lamports
        require!(sol_bet_amount <= 100000, MyError::DataTooLarge);
        require!(sol_bet_amount >= 100, MyError::DataTooSmall);

        let lamports = **ctx.accounts.user.try_borrow_lamports()?;


        //Check that buyer has enouph lamports for transfer  
        if lamports < sol_bet_amount  {
            return Err(error!(MyError::InsuficientUserFunds));
        }
        
        msg!("Amount of lamports user have on account {}", lamports);
            
        //Check that user have enouph tokens for the bet
        require!(
            lamports >= sol_bet_amount,
            MyError::InsuficientUserFunds
        );

        let vault_lamports = **ctx.accounts.vault_sol_account.try_borrow_lamports()?;
        
        msg!("Lamports balance of escrow treasury {}", vault_lamports);        
            
        //Check the tresure have enouph tokens to return equal result bet        
        require!(vault_lamports  > sol_bet_amount*10, MyError::InsuficientTreasury);        
        
        
        //Transfer lamports amount to vault
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault_sol_account.key(),
            sol_bet_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault_sol_account.to_account_info(),
            ],
        )?;                      
        
        //Query chainlink for price information
        let round = chainlink::latest_round_data(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;
        
        
        let description = chainlink::description(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;

        let decimals = chainlink::decimals(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;

        // Save the price in escrow account        
        ctx.accounts.escrow_account_sol.value=round.answer;
        ctx.accounts.escrow_account_sol.decimals=u32::from(decimals);

        //Save bet amount into escrow account
        ctx.accounts.escrow_account_sol.sol_bet_amount = sol_bet_amount;

        //Save bet on result in escrow account
        ctx.accounts.escrow_account_sol.bet_on_result=bet_on_result;
        

        //Save betted coin pair id in escrow account
        ctx.accounts.escrow_account_sol.pair_name = 
            *ctx.accounts.chainlink_feed.to_account_info().key;

        //Save user authority for the bet result
        ctx.accounts.escrow_account_sol.better_account = *ctx.accounts.user.to_account_info().key;   
        

        //Initialize escrow as active
        ctx.accounts.escrow_account_sol.active = true;    

        //create winning field
        ctx.accounts.escrow_account_sol.user_wins = false;   

        // Save bet time
        ctx.accounts.escrow_account_sol.bet_time = ctx.accounts.clock.unix_timestamp;
        // Sav bet time lock
        ctx.accounts.escrow_account_sol.time_lock = time_to_lock;
        
        msg!("{} price is {}", description, round.answer);
        msg!("User betted  {} tokens for:", sol_bet_amount);
        //Check bet on result
        match bet_on_result {
            0 => msg!("bet result suspended to be Rise"),
            1 => msg!("bet result suspended to be Equal"),
            2 => msg!("bet result suspended to be Decrease"),
            _ => return Err(error!(MyError::WrongBetOnResult)),        
        }        
        
        Ok(())
    }
        
        pub fn check_bet(
            ctx:Context<CheckBet>            
        ) -> Result<()>  {
            
            //Check the escrow is active
            require!(ctx.accounts.escrow_account.active==true,
                MyError::EscrowIsClosed );
            
            msg!("User token account provided for bet result check {}",
                ctx.accounts.user_deposit_token_account.key());
            
            //Check that provided user token corresponds to escrows
            require!(ctx.accounts.user_deposit_token_account.key() == 
                ctx.accounts.escrow_account.better_account,
                MyError::WrongBetterAccount );
                
            //Check that provided coin pair id corresponds to escrows    
            require!(ctx.accounts.chainlink_feed.to_account_info().key() == 
                ctx.accounts.escrow_account.pair_name,
                MyError::WrongPairName );
                
            //Calculate treasury authority
            let (_vault_authority, vault_authority_bump) =
                Pubkey::find_program_address(&[ESCROW_PDA_SEED],
                    ctx.program_id);
            let authority_seeds = &[&ESCROW_PDA_SEED[..],
                &[vault_authority_bump]];
                
            //Query coin price or refund user token account and deactivate escrow
            let round = match chainlink::latest_round_data(
                ctx.accounts.chainlink_program.to_account_info(),
                ctx.accounts.chainlink_feed.to_account_info(),
            ) {
                Ok(round) => round,
                Err(err)=> {
                    msg!("The is an error accured while chainlink data request: {}",err.to_string());
                    token::transfer(
                            ctx.accounts.into_transfer_to_user_context()
                            .with_signer(&[&authority_seeds[..]]),
                            ctx.accounts.escrow_account.bet_amount,
                    )?;
                    ctx.accounts.escrow_account.bet_amount=0;
                    ctx.accounts.escrow_account.active=false;
                    return Ok(());
                }
            };
            
            //Query chainlink props
            let description = chainlink::description(
                ctx.accounts.chainlink_program.to_account_info(),
                ctx.accounts.chainlink_feed.to_account_info(),
            )?;
            let _decimals = chainlink::decimals(
                ctx.accounts.chainlink_program.to_account_info(),
                ctx.accounts.chainlink_feed.to_account_info(),
            )?;
            
            //Read escrow for bet props
            let escrow_account = &ctx.accounts.escrow_account;
            
            msg!("{} new price is {}", description, round.answer);
            msg!("{} old price is {}", description, escrow_account.value);
            
            //Check the result of the bet
            match escrow_account.bet_on_result {
                0 => {                    
                    msg!("Bet result supposed to be Rise");
                    if round.answer > escrow_account.value {
                        msg!("You win a bet");
                        //Double refund user's token account
                        token::transfer(
                            ctx.accounts.into_transfer_to_user_context()
                            .with_signer(&[&authority_seeds[..]]),
                            ctx.accounts.escrow_account.bet_amount*2,
                        )?;
                        //Deactivate escrow
                        ctx.accounts.escrow_account.bet_amount=0;
                        ctx.accounts.escrow_account.active=false;
                        ctx.accounts.escrow_account.user_wins = true; 
                        return Ok(());
                    }
                },
                1 => {
                    msg!("Bet result supposed to be Equal");
                    if round.answer == escrow_account.value {
                        msg!("You win a bet");
                        //Ten times refund user's token account
                        token::transfer(
                            ctx.accounts.into_transfer_to_user_context()
                            .with_signer(&[&authority_seeds[..]]),
                            ctx.accounts.escrow_account.bet_amount*10,
                        )?;
                        //Deactivate escrow
                        ctx.accounts.escrow_account.bet_amount=0;
                        ctx.accounts.escrow_account.active=false;
                        ctx.accounts.escrow_account.user_wins = true; 
                        return Ok(());
                    }
                },
                2 => {
                    msg!("Bet result suspended to be Decrease");
                    if round.answer < escrow_account.value {
                        msg!("You win a bet");
                        //Double refund user's token account
                        token::transfer(
                            ctx.accounts.into_transfer_to_user_context()
                            .with_signer(&[&authority_seeds[..]]),
                            ctx.accounts.escrow_account.bet_amount*2,
                        )?;
                        //Deactivate escrow
                        ctx.accounts.escrow_account.bet_amount=0;
                        ctx.accounts.escrow_account.active=false;
                        ctx.accounts.escrow_account.user_wins = true; 
                        return Ok(());
                    }
                },
                _ => return Err(error!(MyError::WrongBetOnResultInEscrow)),
                    
            }
            msg!("You LOOSE a bet");
            //Don't return anithing and deactivate escrow
            ctx.accounts.escrow_account.bet_amount=0;
            ctx.accounts.escrow_account.active=false;
            return Ok(());
        }


        pub fn check_bet_sol(
            ctx:Context<CheckBetSol>            
        ) -> Result<()>  {

            require!(ctx.accounts.clock.unix_timestamp <
                    ctx.accounts.escrow_account_sol.bet_time +
                    ctx.accounts.escrow_account_sol.time_lock+60,
                MyError::EarlyEscrowCheck
            );
            
            //Check the escrow is active
            require!(
                ctx.accounts.escrow_account_sol.active==true,
                MyError::EscrowIsClosed 
            );           
                
            //Check that provided coin pair id corresponds to escrows    
            require!(ctx.accounts.chainlink_feed.to_account_info().key() == 
                ctx.accounts.escrow_account_sol.pair_name,
                MyError::WrongPairName );
	    
            let amount = ctx.accounts.escrow_account_sol.sol_bet_amount;
                                           
            //Query coin price or refund user token account and deactivate escrow
            let round = match chainlink::latest_round_data(
                ctx.accounts.chainlink_program.to_account_info(),
                ctx.accounts.chainlink_feed.to_account_info(),
            ) {
                Ok(round) => round,
                Err(err)=> {
                    msg!("The is an error accured while chainlink data request: {}",err.to_string());                    

                    //Transfer queried amount from vault to user
                    **ctx.accounts.vault_sol_account.try_borrow_mut_lamports()? -= amount ;
                    **ctx.accounts.better_account.try_borrow_mut_lamports()? += amount; 
                    ctx.accounts.escrow_account_sol.sol_bet_amount=0;
                    ctx.accounts.escrow_account_sol.active=false;
                    return Ok(());
                }
            };
            
            //Query chainlink props
            let description = chainlink::description(
                ctx.accounts.chainlink_program.to_account_info(),
                ctx.accounts.chainlink_feed.to_account_info(),
            )?;
            let _decimals = chainlink::decimals(
                ctx.accounts.chainlink_program.to_account_info(),
                ctx.accounts.chainlink_feed.to_account_info(),
            )?;
            
            //Read escrow for bet props
            let escrow_account_sol = &ctx.accounts.escrow_account_sol;
            
            msg!("{} new price is {}", description, round.answer);
            msg!("{} old price is {}", description, escrow_account_sol.value);
            
            //Check the result of the bet
            match escrow_account_sol.bet_on_result {
                0 => {                    
                    msg!("Bet result supposed to be Rise");
                    if round.answer > escrow_account_sol.value {
                        msg!("You win a bet");
                        //Double refund user's account
                        //Transfer queried amount from vault to user
                        **ctx.accounts.vault_sol_account.try_borrow_mut_lamports()? -= amount*2 ;
                        **ctx.accounts.better_account.try_borrow_mut_lamports()? += amount*2; 
                        
                        //Deactivate escrow
                        ctx.accounts.escrow_account_sol.sol_bet_amount=0;
                        ctx.accounts.escrow_account_sol.active=false;
                        ctx.accounts.escrow_account_sol.user_wins = true; 
                        return Ok(());
                    }
                },
                1 => {
                    msg!("Bet result supposed to be Equal");
                    if round.answer == escrow_account_sol.value {
                        msg!("You win a bet");
                        //Ten times refund user's token account
                        //Transfer queried amount from vault to user
                        **ctx.accounts.vault_sol_account.try_borrow_mut_lamports()? -= amount*10 ;
                        **ctx.accounts.better_account.try_borrow_mut_lamports()? += amount*10; 
                        
                        //Deactivate escrow
                        ctx.accounts.escrow_account_sol.sol_bet_amount=0;
                        ctx.accounts.escrow_account_sol.active=false;
                        ctx.accounts.escrow_account_sol.user_wins = true; 
                        return Ok(());
                    }
                },
                2 => {
                    msg!("Bet result suspended to be Decrease");
                    if round.answer < escrow_account_sol.value {
                        msg!("You win a bet");
                        //Double refund user's token account
                        //Transfer queried amount from vault to user
                        **ctx.accounts.vault_sol_account.try_borrow_mut_lamports()? -= amount*2 ;
                        **ctx.accounts.better_account.try_borrow_mut_lamports()? += amount*2; 
                       
                        //Deactivate escrow
                        ctx.accounts.escrow_account_sol.sol_bet_amount=0;
                        ctx.accounts.escrow_account_sol.active=false;
                        ctx.accounts.escrow_account_sol.user_wins = true; 
                        return Ok(());
                    }
                },
                _ => return Err(error!(MyError::WrongBetOnResultInEscrow)),
                    
            }
            msg!("You LOOSE a bet");
            //Don't return anithing and deactivate escrow
            ctx.accounts.escrow_account_sol.sol_bet_amount=0;
            ctx.accounts.escrow_account_sol.active=false;
            return Ok(());
        }
        
        pub fn withdrawal(
            ctx:Context<Withdrawal>,
            withdraw_amount: u64,
        ) -> Result<()>  {        
            
            require!(ctx.accounts.withdrawal_account.owner ==
                ctx.accounts.user.key(),
                MyError::UnauthorizedWithdrawal );
            
            let withdrawal_account_saved = Pubkey::from_str(WITHDRAWAL_ACCOUNT)
                .expect("Unknown Account coded in smartcontract");           
            
            msg!("Withdrowing to provided account {}",ctx.accounts.withdrawal_account.key());
        
            require!(ctx.accounts.withdrawal_account.key()==
                withdrawal_account_saved,
                MyError::WithdrawalToUnknown );
                
            msg!("Token balance of escrow treasury {}",
            ctx.accounts.treasury_account.amount);        
            
            //Check the tresure have enouph tokens to withdraw        
            require!(ctx.accounts.treasury_account.amount > withdraw_amount,       MyError::InsuficientTreasuryForWithdraw);
            
            //Calculate treasury authority
            let (_vault_authority, vault_authority_bump) =
                Pubkey::find_program_address(&[ESCROW_PDA_SEED],
                    ctx.program_id);
            let authority_seeds = &[&ESCROW_PDA_SEED[..],
                &[vault_authority_bump]];
            
            token::transfer(
                ctx.accounts.into_transfer_to_withdraw_context()
                .with_signer(&[&authority_seeds[..]]),
                withdraw_amount,
                )?;
            
            
            Ok(())
        }


pub fn withdrawal_sol(
            ctx:Context<WithdrawalSol>,
            withdraw_amount: u64,
        ) -> Result<()>  {                    
            
            let withdrawal_account_saved = Pubkey::from_str(WITHDRAWAL_SOL_ACCOUNT)
                .expect("Unknown Account coded in smartcontract");           
            
            msg!("Withdrowing to provided account {}",ctx.accounts.withdrawal_account.key());
        
            require!(ctx.accounts.withdrawal_account.key()==
                withdrawal_account_saved,
                MyError::WithdrawalToUnknown );
                
            msg!("Token balance of escrow treasury {}",
            **ctx.accounts.vault_sol_account.try_borrow_mut_lamports()?);        
            
            //Check the tresure have enouph tokens to withdraw        
            require!(**ctx.accounts.vault_sol_account.try_borrow_mut_lamports()? > withdraw_amount,       MyError::InsuficientTreasuryForWithdraw);            

            //Transfer queried amount from vault to user
            **ctx.accounts.vault_sol_account.try_borrow_mut_lamports()? -= withdraw_amount ;
            **ctx.accounts.withdrawal_account.try_borrow_mut_lamports()? += withdraw_amount;                 
            
            Ok(())
        }
}


 

#[derive(Accounts)]
pub struct Initialize<'info> {    
    #[account(mut)]
    pub initializer: Signer<'info>,    
    #[account(
        init,
        seeds = [b"token-seed".as_ref()],
        bump,
        payer = initializer,
        token::mint = mint,
        token::authority = initializer,
    )]
    pub vault_account: Account<'info, TokenAccount>,   
    /// CHECK: checked with seeds
    #[account(
        init,
        seeds = [b"sol-seed".as_ref()],        
        payer = initializer,
        bump,
        space = 8 + 8,
    )]
    vault_sol_account: AccountInfo<'info>, 
    pub mint: Account<'info, Mint>,       
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,    
    pub token_program: Program<'info, Token>,
}

impl<'info> Initialize<'info> {
    
    fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.vault_account.to_account_info().clone(),
            current_authority: self.initializer.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.to_account_info().clone(), cpi_accounts)
    }

}



#[derive(Accounts)]
pub struct InitializeSol<'info> {
    
    #[account(mut)]
    pub initializer: Signer<'info>,   
    /// CHECK: checked with seeds
    #[account(
        init,
        seeds = [b"sol-seed".as_ref()],        
        payer = initializer,
        bump,
        space = 8 + 8,
    )]
    vault_sol_account: AccountInfo<'info>,        
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,    
    
}

/*
#[derive(Accounts)]
pub struct ShowDia<'info> {
    //DIA
    #[account()]
    pub coin_info: Box<Account<'info, CoinInfo>>,
}
*/

#[derive(Accounts)]
pub struct Execute<'info> {    
    #[account(zero)]
    pub escrow_account: Box<Account<'info, EscrowAccount>>, 
    #[account(mut)]
    pub user: Signer<'info>,
     #[account(mut)]
    pub treasury_account: Account<'info, TokenAccount>,    
    #[account(mut)]
    pub user_deposit_token_account: Account<'info, TokenAccount>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_feed: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_program: AccountInfo<'info>,       
    pub system_program: Program<'info, System>,      
    pub token_program: Program<'info, Token>,
}


impl<'info> Execute<'info> {
    fn into_transfer_to_pda_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self
                .user_deposit_token_account
                .to_account_info()
                .clone(),
            to: self.treasury_account.to_account_info().clone(),
            authority: self.user.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.to_account_info().clone(), cpi_accounts)
    }
    
}


#[derive(Accounts)]
pub struct CheckBet<'info> {
    #[account(mut, signer)]
    pub escrow_account: Box<Account<'info, EscrowAccount>>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_feed: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_program: AccountInfo<'info>,
    #[account(mut)]
    pub treasury_account: Box<Account<'info, TokenAccount>>,  
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub treasury_authority: AccountInfo<'info>,
    #[account(mut)]
    pub user_deposit_token_account: Box<Account<'info, TokenAccount>>,    
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_program: AccountInfo<'info>,
    
}

impl<'info> CheckBet<'info> {
    fn into_transfer_to_user_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.treasury_account.to_account_info().clone(),
            to: self
                .user_deposit_token_account
                .to_account_info()
                .clone(),
            authority: self.treasury_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }        
}

#[derive(Accounts)]
pub struct MakeBetSol<'info> {    
    #[account(zero)]
    pub escrow_account_sol: Box<Account<'info, EscrowAccountSol>>,    
    #[account(mut)]
    pub user: Signer<'info>,   
    /// CHECK: checked with seed
    #[account(
        mut,
        seeds = [b"sol-seed",],
        bump
    )]
    vault_sol_account: AccountInfo<'info>,       
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_feed: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_program: AccountInfo<'info>,
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,         
}

#[derive(Accounts)]
pub struct CheckBetSol<'info> {
    #[account(mut, has_one = better_account)]
    pub escrow_account_sol: Box<Account<'info, EscrowAccountSol>>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_feed: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub chainlink_program: AccountInfo<'info>,
    #[account(mut)]
    pub better_account: Signer<'info>,   
    /// CHECK: checked with seed
    #[account(
        mut,
        seeds = [b"sol-seed",],
        bump
    )]
    pub vault_sol_account: AccountInfo<'info>,          
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,        
}

#[derive(Accounts)]
pub struct Withdrawal<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
     #[account(mut)]
     pub withdrawal_account: Box<Account<'info, TokenAccount>>,
     #[account(mut)]
    pub treasury_account: Box<Account<'info, TokenAccount>>,  
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub treasury_authority: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_program: AccountInfo<'info>,
    pub user: Signer<'info>,     
}

impl<'info> Withdrawal <'info> {
    fn into_transfer_to_withdraw_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.treasury_account.to_account_info().clone(),
            to: self
                .withdrawal_account
                .to_account_info()
                .clone(),
            authority: self.treasury_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }        
}

#[derive(Accounts)]
pub struct WithdrawalSol<'info> {   
     #[account(mut)]
     pub withdrawal_account: Signer<'info>,
      /// CHECK: checked with seed
    #[account(
        mut,
        seeds = [b"sol-seed",],
        bump
    )]
    pub vault_sol_account: AccountInfo<'info>,     
    pub system_program: Program<'info, System>,            
}
 
#[account]
pub struct EscrowAccount {
    pub value: i128,
    pub decimals: u32,
    pub bet_amount: u64,
    pub bet_on_result: u64,
    pub pair_name: Pubkey,
    pub better_account: Pubkey,
    pub active: bool,
    pub user_wins: bool,       
}


#[account]
pub struct EscrowAccountSol {
    pub value: i128,
    pub decimals: u32,
    pub sol_bet_amount: u64,
    pub bet_on_result: u64,
    pub pair_name: Pubkey,
    pub better_account: Pubkey,
    pub active: bool,
    pub user_wins: bool,
    pub bet_time: i64,
    pub time_lock: i64,    
    
}
/*
#[account]
pub struct CoinInfo {
    price: u64,
    supply: u64,
    last_update_timestamp: u64,
    authority: Pubkey,
    symbol: String
}
*/

#[error_code]
pub enum MyError {
    #[msg("Program may only take a bet les 100000")]
    DataTooLarge,
    #[msg("Program may only take a bet more 100")]
    DataTooSmall,
    #[msg("User dont have enouph funds for the bet")]
    InsuficientUserFunds,
    #[msg("User bet is too high for the Treasury")]
    InsuficientTreasury,
    #[msg("Error in bet on result provided for escrow")]
    WrongBetOnResult,    
    #[msg("Error in reading suspended bet on result")]
    WrongBetOnResultInEscrow,    
    #[msg("Token account for refund is wrong")]
    WrongBetterAccount,
    #[msg("User is checking another account, not an escrow one")]
    WrongPairName,
    #[msg("Provided escrow account is closed")]
    EscrowIsClosed,
    #[msg("The provided withraw account is unknown")]
    WithdrawalToUnknown,
    #[msg("Treasury has not enouph tokens for requested withdraw")]
    InsuficientTreasuryForWithdraw,
    #[msg("Withdrawal is not authorized by withdraw account owner")]
    UnauthorizedWithdrawal,
    #[msg("Escrow check is out of locked time")]
    EarlyEscrowCheck
}


