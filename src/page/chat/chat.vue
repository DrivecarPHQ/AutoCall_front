<template>
  	<div :class="style.chat">
      <!-- 对话板块 -->
      <div :class="style.chat_block">
        <div :class="style.customer_info">
          <span><label>姓名：</label>{{thirdPath}}</span>
          <span><label>电话号码：</label>{{phoneNum}}</span>
          <span><label>性别：</label>{{sex}}</span>
          <span><label>拨打时间：</label>{{phoneTime}}</span>
          <span :class="style.customer_detail">用户详情</span>
        </div>

        <div :class="style.player">
          <aplayer
          v-if="mediaUrl"
          :music="{
            title: 'secret base~君がくれたもの~',
            artist: 'Silent Siren',
            src: mediaUrl,
            pic: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg'
          }"
          ref="player"/>
        </div>

        <ul :class="style.chat_content" id="chat_con">
          <li :class="item.identityType=='0'?style.robot:style.man" v-for="item in talkList">
            <span :class="style.talker_name">{{item.identityType=='robot'?'AI':thirdPath[0]}}</span>
            <span :class="style.talker_msg" @click="showRealTwistDialog(item)">{{item.content + (item.identityType=='robot'?''+item.processId:'')}}</span>
          </li>
        </ul>
      </div>
      <!-- 结果板块 -->
      <div :class="style.result_block">
        <div :class="style.result_block_header">
          通话结果
        </div>
        <div :class="style.result_block_content">
          <p><label>任务名称：</label>{{secondPath}}</p>
          <p><label>呼叫时间：</label>{{phoneTime}}</p>
          <p><label>呼叫状态：</label>{{callState}}</p>
          <div :class="style.holding_time">
            <h3>{{holdingTime}}秒</h3>
            <p>通话时长</p>
          </div>
        </div>
      </div>

      <!-- 意愿登记板块 -->
      <div :class="style.range_block">
        <div :class="style.range_block_header">
          客户意向
        </div>
        <div :class="style.range_block_content">
          <ul :class="style.range_type">
            <li :class="style.range_type_item">A级</li>
            <li :class="style.range_type_item">B级</li>
            <li :class="style.range_type_item">C级</li>
            <li :class="style.range_type_item">D级</li>
            <li :class="style.range_type_item">E级</li>
          </ul>
        </div>
      </div>


      <!-- 修改真实意图 -->
      <el-dialog title="真实意图" :visible.sync="dialogRealTwist" close-on-click-modal modal center :class="style.dialog">
        <el-form label-width="100px">
          <el-form-item label="机器识别意图：" >
            
          </el-form-item>
          <el-form-item label="要修改的意图：" >
            <el-select v-model="realTwist" placeholder="请选择">
              <!-- <el-option
                v-for="(item, index) in stateMap"
                :key="item"
                :label="item"
                :value="index+1">
              </el-option> -->
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRealTwist = false">取 消</el-button>
          <el-button type="primary" @click="submitRealTwist">保 存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import io from 'socket.io-client';
import style from './chat.less'
import { mapState } from 'vuex'
import Aplayer from 'vue-aplayer'
import ajax from 'src/config/acrajax'

export default {
	name: 'chat',
  data:()=>({
    style,
    talkList:[], //对话数据
    socket:{},  //socket对象
    mediaUrl:'',
    isCompleted:true, //是否已经自动拨打完
    dialogRealTwist:false, //显示真实意图对话框
    realTwist:''  //真实意图数据
  }),
  components:{
    Aplayer
  },
  async created(){
    this.$store.commit({
      type: 'SELECT_TASK',
      phoneNum:'139****2490',
      sex:'男',
      phoneTime:'2017-12-07 18:31:43',
      callState:'呼叫成功',
      holdingTime:54
    })
    this.$store.commit({
      type: 'CHANGE_THIRD_PATH',
      thirdPath: this.$route.params.userName
    })

    if(this.isCompleted) {
      const data = await ajax('POST','getDialog', {taskId:1})
      this.talkList = JSON.parse(JSON.stringify(data.data))
    } else {
      this.createSocket()
    }
  },
  computed: mapState({
    // 箭头函数可使代码更简练
    secondPath: state => state.secondPath,
    thirdPath: state => state.thirdPath,
    customerName: state => state.customerName,
    phoneNum: state => state.phoneNum,
    sex: state => state.sex,
    phoneTime: state => state.phoneTime,
    callState: state => state.callState,
    holdingTime: state => state.holdingTime,
    thirdNav: state => state.thirdNav,
    manProcessId: function() {
      let temp = this.talkList.map((item)=>{
        if (item.type == '0') {
          return item.processId
        } else {
          return 0
        }
      })
      //[0,0,0,111,0,0,112,0,113] => [111,111,111,111,112,112,112,113,113]
      for (let i = 0; i < temp.length; i++) {
        this.fillZero(temp, i)
      }
      return temp
    }
  }),
  updated() {
    document.getElementById('chat_con').scrollTop = document.getElementById('chat_con').scrollHeight - document.getElementById('chat_con').clientHeight
  },
  destroyed() {
    if(!this.isCompleted) {
      this.socket.close()
    }
  },
  methods: {
		createSocket() {

      // 建立socket连接
      this.socket =io.connect('127.0.0.1:5002/acr');
      // socket.on('connect',()=>{
      //
      // });
      // setInterval(()=>{
      //   console.log(this.$refs.player.playProgress);
      // }, 3000)
      setInterval(() => {
        this.socket.emit('request_for_response',{'param':'man'});
        setTimeout(()=>{
          this.socket.emit('request_for_response',{'param':'robot'});
        },Math.random()*1500)
      }, 3000)


      //监听回复的消息
      this.socket.on('give_chat_record',(data) => {
          if (data.code == '200'){
              const identityType = (data.data.type == 'robot'?'0':'1')
              this.talkList.push(data.data)
              ajax('POST','insertDialog', {taskId:1, content:data.data.msg, identityType, machineId: 1, phoneNum:'13929582490'}, false)
          }
          else{
              alert('ERROR:' + data.msg);
          }
      });

      this.socket.emit('set_phone_num','15920597147');

    },
    showRealTwistDialog(item) {
      this.dialogRealTwist = true;
      console.log(item)
    },
    submitRealTwist() {
      this.dialogRealTwist = false;
      console.log('l')
    },
    fillZero(arr, i) {
      while(arr[i] == 0) {
        arr[i] = this.fillZero(arr, i+1)
      }
      return arr[i]
    }
	}
}
</script>
