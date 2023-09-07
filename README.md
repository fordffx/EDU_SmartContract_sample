# EDU_SmartContract_sample

Simple Hyperledger Fabric chaincode used in education proccess

使用说明：
1.按https://hyperledger-fabric.readthedocs.io/en/latest/deploy_chaincode.html的说明配置好网络,到npm install这一步停下，进入第2步；

2.在部署链码之前将 index.js、package.json、studentAssetTransfer.js 放到一个文件夹中（如chaincode_js），在此文件夹下新建一名为“lib”的文件夹，将studentAssetTransfer.js放在lib中；

3.将chaincode_js文件夹整体拷贝到“/fabric-samples/asset-transfer-basic/”目录下；

4.cd到“/fabric-samples/asset-transfer-basic/chaincode_js”目录下继续使用npm install命令，后面按操作说明继续就行了。

5.命令的使用方法、链码内函数的调用和账本查询方法在终端输入输出日志terminal_log.txt中，供参考。
