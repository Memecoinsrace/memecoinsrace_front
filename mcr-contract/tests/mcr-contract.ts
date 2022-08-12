import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { McrContract } from "../target/types/mcr_contract";

describe("mcr-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.McrContract as Program<McrContract>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
