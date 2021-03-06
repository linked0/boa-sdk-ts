/*******************************************************************************

    The class that defines the transaction's input in a block.

    Copyright:
        Copyright (c) 2020 BOS Platform Foundation Korea
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/

import { Hash } from './Hash';
import { Signature } from './Signature';

import { SmartBuffer } from 'smart-buffer';

/**
 * The class that defines the transaction's inputs in a block.
 */
export class TxInput
{
    /**
     * The hash of the previous transaction containing the output to spend
     */
    public previous: Hash;

    /**
     * The index of the output in the previous transaction
     */
    public index: number;

    /**
     * A signature that should be verified using public key of the output in the previous transaction
     */
    public signature: Signature;

    /**
     * Constructor
     * @param previous The hash of the previous transaction containing the output to spend
     * @param index The index of the output in the previous transaction
     * @param signature A signature that should be verified using public key of the output in the previous transaction
     */
    constructor(previous?: Hash, index?: number, signature?: Signature)
    {
        if (previous !== undefined)
            this.previous = new Hash(previous.data);
        else
            this.previous = new Hash();

        if (index !== undefined)
            this.index = index;
        else
            this.index = 0;

        if (signature !== undefined)
            this.signature = new Signature(signature.data);
        else
            this.signature = new Signature();
    }

    /**
     * Collects data to create a hash.
     * @param buffer The buffer where collected data is stored
     */
    public computeHash (buffer: SmartBuffer)
    {
        this.previous.computeHash(buffer);
        buffer.writeUInt32LE(this.index);
    }
}
