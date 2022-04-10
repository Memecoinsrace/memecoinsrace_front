import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BetProgram } from "../target/types/bet_program";

describe("bet-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.BetProgram as Program<BetProgram>;

  it("Is initialized!", async () => {
    // Add your test here.
    
  });
});
