/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
  
class StudentAssetTransfer extends Contract {  
  async InitLedger(ctx) {
      //学生账户地址	知识点编号	知识点名称	学习状态
      //studentId, studentName, knowledgePointId, knowledgePointName, learningStatus
        const assets = [
            {
                studentId: 'strudent001',
                studentName: 'yangguo',
                knowledgePointId: 5,
                knowledgePointName: '函数的单调性',
                learningStatus: '理解运用',
            },
            {
                studentId: 'strudent002',
                studentName: 'huangwei',
                knowledgePointId: 5,
                knowledgePointName: '函数的单调性',
                learningStatus: '理解运用',
            },{
                studentId: 'strudent003',
                studentName: 'wanglin',
                knowledgePointId: 5,
                knowledgePointName: '函数的单调性',
                learningStatus: '未学习',
            },{
                studentId: 'strudent004',
                studentName: 'zhengfang',
                knowledgePointId: 5,
                knowledgePointName: '函数的单调性',
                learningStatus: '理解运用',
            },{
                studentId: 'strudent005',
                studentName: 'luoyun',
                knowledgePointId: 5,
                knowledgePointName: '函数的单调性',
                learningStatus: '未学习',
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.studentId, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }
  
  async AssetExists(ctx, studentId) {
        const assetJSON = await ctx.stub.getState(studentId);
        return assetJSON && assetJSON.length > 0;
    }
  
  // CreateAsset issues a new asset to the world state with given details.
  async CreateAsset(ctx, studentId, studentName, knowledgePointId, knowledgePointName, learningStatus) {
        const exists = await this.AssetExists(ctx, studentId);
        if (exists) {
            throw new Error(`The learning record ${studentId} already exists`);
        }

        const asset = {
                studentId: studentId,
                studentName: studentName,
                knowledgePointId: knowledgePointId,
                knowledgePointName: knowledgePointName,
                learningStatus: learningStatus,
            };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(studentId, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }
  
  async DeleteAsset(ctx, studentId) {
        const exists = await this.AssetExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The learning record ${studentId} does not exist`);
        }
        return ctx.stub.deleteState(studentId);
    }
  
  async TransferAsset(ctx, studentId, newlearningStatus) {
        const assetString = await this.ReadAsset(ctx, studentId);
        const asset = JSON.parse(assetString);
        const oldstate = asset.learningStatus;
        asset.learningStatus = newlearningStatus;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(studentId, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldstate;
    }
  
  // ReadAsset returns the asset stored in the world state with given id.
  async ReadAsset(ctx, studentId) {
        const assetJSON = await ctx.stub.getStatestudentId(studentId); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The learning record ${studentId} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
  async UpdateAsset(ctx, studentId, studentName, knowledgePointId, knowledgePointName, learningStatus) {
        const exists = await this.AssetExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The learning record  ${studentId} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
                studentId: studentId,
                studentName: studentName,
                knowledgePointId: knowledgePointId,
                knowledgePointName: knowledgePointName,
                learningStatus: learningStatus,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(studentId, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }
  
        
  async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}
  
module.exports = StudentAssetTransfer;
