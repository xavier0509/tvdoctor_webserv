                                             
var  CMD_ARGUMENT_TYPE_NONE = 0x0000;
var  CMD_ARGUMENT_TYPE_INT32 = 0x0001;
var  CMD_ARGUMENT_TYPE_STRING = 0x0002;
var  CMD_ARGUMENT_TYPE_KEYVALUE = 0x0003;

var  CMD_REG_PC =0x00000004;//PC向服务器注册命令
var  CMD_TELLME_SRV_ID =0x00000006; //服务器告诉pc,服务器的id
var  CMD_TELLME_TV_ID =0x00000008;//服务器告诉PC，TV的id
var  CMD_NOTIFY_TV_OFFLINE = 0x0000000A;//通知pC，会话TV已经与服务器断开
var  CMD_PC_NEED_EXIT = 0x0000000C;//PC主动与服务器断开连接
var  CMD_USER_REFUSED = 0x0000000E;//用户拒绝请求
var  CMD_NOTIFY_SHOWPHOTO=0x00000010;//TV可以显示截取的图片 字符串 文件路径
var  CMD_NOTIFY_DOWNLOADFILE = 0x00000012;//TV下载抓取好的文件  字符串 文件路径
var  CMD_NOTIFY_DOWNLOADLOGFILE =0x00000014;//PC端准备从服务器端下载日志文件
var  CMD_ANOTHER_PC_CTRL= 0x00000018;//TV同意新的PC进行控制，通知旧的PC退出了控制，TV退出被旧PC控制
//var  CMD_NOTIFY_UPLOADFILE_SUCCESS= 0x00000016;

var  CMD_SEND_VIRKEY   = 0x00020000;//发送虚拟按键值  按键值（4字节）
var  CMD_START_TELNETD = 0x00020002;//开启telnet服务
var  CMD_STOP_TELNETD  = 0x00020004;//停止telnet服务
var  CMD_SNATCH_LOG    = 0x00020006;//pc请求抓取TV一时间的LOG  int32，抓取秒数
var  RET_SNATCH_LOG    = 0x00020007;//抓取日志的返回结果
var  CMD_START_SNATCH_LOG = 0x00020008;//PC请示抓取log取日志  表示文件名
var  CMD_TELNET_DATA   = 0x0002000A;//telnet数据
var  CMD_PRINTE_SCREEN = 0x0002000C; //截取图片
var  CMD_PRINTE_CONTINUE_SCREEN =0x0002000E; //每隔多少s截取一次屏目图片
var  CMD_STOP_SCREEN =0x00020010; //停止截屏
var  CMD_STOP_SNATCH_LOG =0x00020012; //停止抓取日志
var  CMD_REMOTE_PULL_FILE = 0x00020014;//PC通知TV需要获取文件 String:文件路径
var  RET_REMOTE_PULL_FILE = 0x00020015;//TC向PC返回错误码
var  CMD_REMOTE_PUSH_FILE = 0x00020016; //json 串
var  RET_REMOTE_PUSH_FILE = 0x00020017;//文件是否上传成功

var CMD_LOGCAT_START_SCREEN =0x00020018;//单独开logcat连接
var RET_LOGCAT_START_SNATCH =0x00020019;//logcat连接的返回结果
var CMD_LOGCAT_PARAM_SCREEN =0x0002001A;//发logcat命令  带string 参数  pause
var RET_LOGCAT_PARAM_SCREEN =0x0002001B;//logcat的返回结果  
var CMD_LOGCAT_STOP_SCREEN =0x0002002C;//停止logcat连接   
var CMD_GET_TV_INFO = 0X0002001E;//请求获取tv信息
var RET_GET_TV_INFO = 0X0002001F;//返回tv信息  

var T2P_CMD_LOCAL_UPGRADE_CHECK = 0x00020022;//不经过后台
var T2P_CMD_SYSTEM_RECOVERY = 0x00020024;//恢复出厂设置


var  vncPackageContent ={};
vncPackageContent.target = 0;
vncPackageContent.source = 0;
vncPackageContent.version =1;
vncPackageContent.paramType = CMD_ARGUMENT_TYPE_NONE ;
vncPackageContent.reserve = 0 ;//保留
vncPackageContent.command =0; 
vncPackageContent.tag = 0;
vncPackageContent.bufParamLength =0;
vncPackageContent.bufParam ="";

var  crc32 = ""

var  PKG_WRAP_SIZE  =8;
var  PKG_START_OFFSET =4;
var  PKG_FIXED_PART_SIZE =32

function     assemblingProtocol()
{
  //target 发送目标标识的ID字符串的CRC32值
  // source 发送源标识的ID字符串的CRC32值  version =1  attr=0
  //command  命令值 偶数   返回值 奇数 
  var   len =PKG_FIXED_PART_SIZE + vncPackageContent.bufParamLength;
  var  v1 = new Uint8Array(len);
  v1[0] = (len   >> 24 ) & 0xff;
  v1[1] = (len   >> 16 ) & 0xff;
  v1[2] = (len   >> 8 ) & 0xff;
  v1[3] = (len) & 0xff;

  var  startLen = PKG_START_OFFSET;
  v1[startLen+0] = (vncPackageContent.target >> 24 ) & 0xff;
  v1[startLen+1] = (vncPackageContent.target >> 16 ) & 0xff;
  v1[startLen+2] = (vncPackageContent.target >> 8 ) & 0xff;
  v1[startLen+3] = (vncPackageContent.target) & 0xff;
  startLen +=4;

  v1[startLen+0] = (vncPackageContent.source >> 24 ) & 0xff;
  v1[startLen+1] = (vncPackageContent.source >> 16 ) & 0xff;
  v1[startLen+2] = (vncPackageContent.source >> 8 ) & 0xff;
  v1[startLen+3] = (vncPackageContent.source) & 0xff;
  startLen +=4;

  v1[startLen] = (vncPackageContent.version) & 0xff;
  startLen +=1;

  v1[startLen] = (vncPackageContent.paramType) & 0xff;
  startLen +=1;

  startLen +=2;

  v1[startLen+0] = (vncPackageContent.command >> 24 ) & 0xff;
  v1[startLen+1] = (vncPackageContent.command >> 16 ) & 0xff;
  v1[startLen+2] = (vncPackageContent.command >> 8 ) & 0xff;
  v1[startLen+3] = (vncPackageContent.command) & 0xff;
  startLen +=4;

  v1[startLen+0] = (vncPackageContent.tag >> 24 ) & 0xff;
  v1[startLen+1] = (vncPackageContent.tag >> 16 ) & 0xff;
  v1[startLen+2] = (vncPackageContent.tag >> 8 ) & 0xff;
  v1[startLen+3] = (vncPackageContent.tag) & 0xff;
  startLen +=4;

  v1[startLen+0] = (vncPackageContent.bufParamLength >> 24 ) & 0xff;
  v1[startLen+1] = (vncPackageContent.bufParamLength >> 16 ) & 0xff;
  v1[startLen+2] = (vncPackageContent.bufParamLength >> 8 ) & 0xff;
  v1[startLen+3] = (vncPackageContent.bufParamLength) & 0xff;
  startLen +=4;
  for (var i = 0; i < vncPackageContent.bufParamLength; i++) 
  {
     v1[startLen+i] =vncPackageContent.bufParam.charCodeAt(i);
  }

  startLen +=vncPackageContent.bufParamLength;
  var crcbuffer=v1.buffer.toString();
  crc32 = crc32_hash(crcbuffer);
 OutputLog("crc32 ="+crc32);
  v1[startLen+0] = (crc32   >> 24 ) & 0xff;
  v1[startLen+1] = (crc32   >> 16 ) & 0xff;
  v1[startLen+2] = (crc32   >> 8 ) & 0xff;
  v1[startLen+3] = (crc32) & 0xff;

  OutputLog("bufer ="+v1.buffer+",len ="+len);
  return  v1.buffer;
}

function  decodeProtocol(buffer )
{
   var   len = buffer.length;
   var   contentSize = len - PKG_START_OFFSET;
   crc32 = (buffer.charCodeAt(len -4) << 24 ) |(buffer.charCodeAt(len -3) << 16 ) |(buffer.charCodeAt(len -2) << 8 ) | buffer.charCodeAt(len -1) ;

   OutputLog("decodeProtocol  crc32="+crc32+", contentSize ="+contentSize);
    //解析数据
   var  startLen = 0 ;
   vncPackageContent.target = (buffer.charCodeAt(startLen+0) << 24 )|(buffer.charCodeAt(startLen+1) << 16 ) |(buffer.charCodeAt(startLen+2) << 8 ) |(buffer.charCodeAt(startLen+3));
   startLen += 4;
   vncPackageContent.source =(buffer.charCodeAt(startLen+0) << 24 )|(buffer.charCodeAt(startLen+1) << 16 ) |(buffer.charCodeAt(startLen+2) << 8 ) |(buffer.charCodeAt(startLen+3));
   OutputLog("target="+vncPackageContent.target+", source ="+vncPackageContent.source );
   startLen += 4;
   vncPackageContent.version = buffer.charCodeAt(startLen);
   startLen += 1;
  
  vncPackageContent.paramType = buffer.charCodeAt(startLen);
  startLen += 1;
 //skip
  startLen += 2;
 // OutputLog("version="+vncPackageContent.version+", paramType ="+vncPackageContent.paramType );
  vncPackageContent.command =(buffer.charCodeAt(startLen+0) << 24 )|(buffer.charCodeAt(startLen+1) << 16 ) |(buffer.charCodeAt(startLen+2) << 8 ) |(buffer.charCodeAt(startLen+3));
  startLen += 4;

  vncPackageContent.tag =(buffer.charCodeAt(startLen+0) << 24 )|(buffer.charCodeAt(startLen+1) << 16 ) |(buffer.charCodeAt(startLen+2) << 8 ) |(buffer.charCodeAt(startLen+3));
  startLen += 4;

  vncPackageContent.bufParamLength =(buffer.charCodeAt(startLen+0) << 24 )|(buffer.charCodeAt(startLen+1) << 16 ) |(buffer.charCodeAt(startLen+2) << 8 ) |(buffer.charCodeAt(startLen+3));
  startLen += 4;

  vncPackageContent.bufParam =buffer.substr(startLen,vncPackageContent.bufParamLength);
  OutputLog("command="+vncPackageContent.command+", tag ="+vncPackageContent.tag+", bufParam="+vncPackageContent.bufParam );
  if (CMD_ARGUMENT_TYPE_INT32 == parseInt(vncPackageContent.paramType,16)) //int32 
   {
        vncPackageContent.bufParam  = parseInt(vncPackageContent.bufParam );
        OutputLog("bufParam =" +vncPackageContent.bufParam);
   }
  // else if (CMD_ARGUMENT_TYPE_KEYVALUE == paramType) //list
   {
   
   }
}

function   setTargetAndSource(source,target)
{
    vncPackageContent.target = target;
    vncPackageContent.source = source;
    vncPackageContent.version =1;
    vncPackageContent.paramType = CMD_ARGUMENT_TYPE_NONE ;
    vncPackageContent.reserve = 0 ;//保留
    vncPackageContent.command =0; 
    vncPackageContent.tag = 0;
    vncPackageContent.bufParamLength =0;
    vncPackageContent.bufParam ="";
}

function  setCommandId(cmd,tag)
{
   vncPackageContent.command =cmd; 
   vncPackageContent.tag =tag;

}

function  setIntegerParam(param)
{
    vncPackageContent.paramType = CMD_ARGUMENT_TYPE_INT32 ;
    var   str11 = param.toString();
    vncPackageContent.bufParam = str11;
    vncPackageContent.bufParamLength =str11.length;
}

function  setStringParam(param)
{
    vncPackageContent.paramType = CMD_ARGUMENT_TYPE_STRING ;
    vncPackageContent.bufParam = param;
    vncPackageContent.bufParamLength = param.length;
}

function  setKeyValueParam(param)
{
    vncPackageContent.paramType = CMD_ARGUMENT_TYPE_KEYVALUE;
    vncPackageContent.bufParam = param;
    vncPackageContent.bufParamLength = param.length;
}

function getSource()
 {
    return  vncPackageContent.source;
 }

 function getTarget()
 {
    return  vncPackageContent.target;
 }

 function  getTag()
 {
    return  vncPackageContent.tag;
}
 function  getCommand()
 {
    return  vncPackageContent.command;
 }

 function  getParamType()
 {
  return vncPackageContent.paramType;
 }

 function getBuferParam()
 {
  return vncPackageContent.bufParam;
 }

 function getBuferLen()
 {
  return  vncPackageContent.bufParamLength;
 }

 function OutputLog(msg)
{
  printlog(msg);
}
