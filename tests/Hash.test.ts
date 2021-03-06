/*******************************************************************************

    Test that create hash.

    Copyright:
        Copyright (c) 2020 BOS Platform Foundation Korea
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/

import * as boasdk from '../lib';

import * as assert from 'assert';

describe('Hash', () => {

    before('Wait for the package libsodium to finish loading', (doneIt: () => void) =>
    {
        boasdk.SodiumHelper.init()
            .then(() =>
            {
                doneIt();
            })
            .catch((err: any) =>
            {
                doneIt();
            });
    });

    // Buffer has the same content. However, when printed with hex strings,
    // the order of output is different.
    // This was treated to be the same as D language.
    it('Test of reading and writing hex string', () => {
        // Read from hex string
        let h = new boasdk.Hash();
        h.fromString('0x5d7f6a7a30f7ff591c8649f61eb8a35d034824ed5cd252c2c6f10cdbd223671' +
            '3dc369ef2a44b62ba113814a9d819a276ff61582874c9aee9c98efa2aa1f10d73');

        // Check
        assert.strictEqual(h.toString(),
            '0x5d7f6a7a30f7ff591c8649f61eb8a35d034824ed5cd252c2c6f10cdbd2236713d' +
            'c369ef2a44b62ba113814a9d819a276ff61582874c9aee9c98efa2aa1f10d73');
    });

    it('Test of hash("abc")', () => {
        // Hash
        let h = boasdk.hash(Buffer.from("abc"));

        // Check
        assert.strictEqual(h.toString(),
            '0x239900d4ed8623b95a92f1dba88ad31895cc3345ded552c22d79ab2a39c5877' +
            'dd1a2ffdb6fbb124bb7c45a68142f214ce9f6129fb697276a0d4d1c983fa580ba');
    });

    // https://github.com/bpfkorea/agora/blob/v0.x.x/source/agora/common/Hash.d#L260-L265
    it('Test of multi hash', () => {
        // Source 1 : "foo"
        let foo = boasdk.hash(Buffer.from("foo"));

        // Source 2 : "bar"
        let bar = boasdk.hash(Buffer.from("bar"));

        // Hash Multi
        let h = boasdk.hashMulti(foo.data, bar.data);

        // Check
        assert.strictEqual(h.toString(),
            '0xe0343d063b14c52630563ec81b0f91a84ddb05f2cf05a2e4330ddc79bd3a06e57' +
            'c2e756f276c112342ff1d6f1e74d05bdb9bf880abd74a2e512654e12d171a74');
    });

    it('Test of utxo key, using makeUTXOKey', () => {
        let tx_hash = new boasdk.Hash();
        tx_hash.fromString('0x5d7f6a7a30f7ff591c8649f61eb8a35d034824ed5cd252c2c6f10cdbd223671' +
            '3dc369ef2a44b62ba113814a9d819a276ff61582874c9aee9c98efa2aa1f10d73');
        //let hash = boasdk.makeUTXOKey(tx_hash, JSBI.BigInt(1));
        let hash = boasdk.makeUTXOKey(tx_hash, boasdk.JSBInt.BigInt(1));
        assert.strictEqual(hash.toString(),
            '0x7c95c29b184e47fbd32e58e5abd42c6e22e8bd5a7e934ab049d21df545e09c2' +
            'e33bb2b89df2e59ee01eb2519b1508284b577f66a76d42546b65a6813e592bb84');
    });

    // See_Also: https://github.com/bpfkorea/agora/blob/93c31daa616e76011deee68a8645e1b86624ce3d/source/agora/consensus/data/Transaction.d#L225-L248
    it ('Test for hash value of transaction data', () =>
    {
        let payment_tx = new boasdk.Transaction(
            boasdk.TxType.Payment,
            [
                new boasdk.TxInput()
            ],
            [
                new boasdk.TxOutput()
            ]
        );

        assert.strictEqual(boasdk.hashFull(payment_tx).toString(),
            "0x9a87d86f702cd0f519efba81cf379f2a06907f34df6546f93c8619af113d0d774" +
            "041b8e45f7975890b98890c7f5b0c062f6dae88ac1ec8d2c25dcf88b9aa01c9");

        let freeze_tx = new boasdk.Transaction(
            boasdk.TxType.Freeze,
            [
                new boasdk.TxInput()
            ],
            [
                new boasdk.TxOutput()
            ]
        );

        assert.strictEqual(boasdk.hashFull(freeze_tx).toString(),
            "0x7c8f238f70318aae788487e57eb6f4793e3b0e48fbe017c1829ec269d07a76661" +
            "5173e9a33739e916b1d40248a48add0296b2a8e51d0f8e1a87bf7acc7c4f136");
    });
});
