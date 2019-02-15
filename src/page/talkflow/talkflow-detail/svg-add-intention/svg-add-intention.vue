<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1">

    <g>
      <g id="intentNode">
        <g :id="'intentNode_'+item.seqId" :transform="'matrix( 1 0 0 1 '+item.translate+' 20 )'"  v-for="item in intentNodeParm">
          <g :id="'nodeExpander_'+item.seqId" :transform="'translate( '+(item.width+12)+' -13 )'" style="cursor: pointer;" @click="deleteIntention(item.seqId)">
            <path id="kity_path_98" fill="rgb(	255,99,71)" stroke="rgb(	255,99,71)" d="M6,0A6,6,0,1,1,-6,0A6,6,0,1,1,6,0"></path>
            <path id="kity_path_99" fill="none" stroke="white" d="M-4.5,0L4.5,0"></path>
          </g>
          <g style="cursor: pointer;" @click="selectIntention(item.seqId)">
            <path fill="rgb(238,245,254)" stroke="rgb(185, 208, 244)" :d="'M0,-15h'+item.width+'a5,5,0,0,1,5,5v30a5,5,0,0,1,-5,5h-'+item.width+'a5,5,0,0,1,-5,-5v-30a5,5,0,0,1,5,-5z'" stroke-width="1"></path>
            <g transform="translate( 0 0 )" fill="rgb(11,112,255)">
              <text text-rendering="inherit" dominant-baseline="text-before-edge" font-size="16" dy="0" y="-8">{{item.twistName}}</text>
            </g>
          </g>
        </g>
      </g>


      <g id="nextNode">
        <g :id="'nextNode_'+item.seqId" :transform="'matrix( 1 0 0 1 '+item.translate+' 150 )'"  v-for="item in nextNodeParm">
          <path fill="rgb(238,245,254)" stroke="rgb(185, 208, 244)" :d="'M0,-15h'+item.width+'a5,5,0,0,1,5,5v'+item.height+'a5,5,0,0,1,-5,5h-'+item.width+'a5,5,0,0,1,-5,-5v-'+item.height+'a5,5,0,0,1,5,-5z'" stroke-width="1"></path>
          <g transform="translate( 0 0 )" fill="rgb(11,112,255)">
            <text text-rendering="inherit" dominant-baseline="text-before-edge" font-size="16" dy="0" :y="-8">名称：{{item.processName}}</text>
            <text text-rendering="inherit" dominant-baseline="text-before-edge" font-size="16" dy="0" :y="-8+30">描述：</text>
            <text text-rendering="inherit" dominant-baseline="text-before-edge" font-size="16" dy="0" :y="(index+2)*30-8" v-for="(item2, index) in item.desc_temp">{{item2}}</text>
          </g>
        </g>
      </g>

      <g id="path">
        <!-- <path fill="none" stroke="rgb(115, 161, 191)" stroke-width="1" :d="'M'+(item.translateFrom+(item.width)/2)+' 20Q '+item.translateFrom+' 90,'+(item.translateTo+(item.width2)/2)+' 90'" transform="translate( 0 0 )" v-for="item in pathParm"></path> -->
        <path fill="none" stroke="rgb(185, 208, 244)" stroke-width="1" :d="'M'+(item.translateFrom+(item.width)/2)+' 45L'+(item.translateTo+(item.width2)/2)+' 135'" transform="translate( 0 0 )" v-for="item in pathParm"></path>
      </g>
      <!-- <g id="minder_node1" transform="matrix( 1 0 0 1 150 20 )" >
        <path id="node_outline1" fill="rgb(115, 161, 191)" stroke="rgb(115, 161, 191)" :d="test" stroke-width="3"></path>
        <g id="node_text1" transform="translate( 0 0 )" fill="white">
          <text id="intention_text_23" text-rendering="inherit" dominant-baseline="text-before-edge" font-size="16" dy="0" y="-8">卓越啊</text>
        </g>
      </g> -->
    </g>

    <g :style="{display:'none'}" id="noneBlock">
      <text :id="'intention_text_'+item.seqId" text-rendering="inherit" dominant-baseline="text-before-edge" font-size="16" v-for="item in intention">{{item.twistName}}</text>
      <text :id="'next_text_'+item.seqId" text-rendering="inherit" dominant-baseline="text-before-edge" font-size="16" v-for="item in flowCount">{{item.str}}</text>
    </g>
  </svg>
</template>

<script>
import style from './svg-add-intention.less'
import { mapState } from 'vuex'
import ajax from 'src/config/acrajax'

export default {
	name: 'svg-add-intention',
  data() {
    return {
      intentNodeParm:[
      ],
      pathParm:[],
      nextNodeParm:[
      ]
    }
  },
  computed : mapState({
    intention : state => state.intention,
    flowList : state => state.flowList,
    flowCount(state) {
      let temp = []
      for (let i = 0; i < state.flowList.length; i++) {
        const num = Math.min(Math.max(( state.flowList[i].processName.length + 3), state.flowList[i].processDesc.length), 16)
        let str = "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
        temp.push({
          seqId:state.flowList[i].seqId,
          str:str.slice(0,num)
        })
      }
      console.log('temp',temp)
      return temp
    }
  }),
  watch: {
    intention: function() {
      setTimeout(()=>{
        console.log(this.intention)
        this.setParm()
      },100)
    }
  },
  created(){
    setTimeout(()=>{
      console.log('intentNodeParm',this.intentNodeParm)
    },3000)
  },
  updated(){
    console.log('update')
    // this.setParm()
    // console.log(document.getElementById('intention_text_22').clientWidth)
  },
  mounted() {
    this.setParm()
  },
  methods: {
    selectIntention(seqId) {
      this.$emit('intentionDetail',seqId);
    },
    async deleteIntention(seqId) {
      this.loading = true;
      const deleteIntention = await ajax('POST', 'delTermTwist', { seqId }, false)
      this.loading = false;
      this.alertMsg('s')

      this.$store.commit({
        type: 'DELETE_INTENTION',
        seqId
      })
      // this.setParm()
    },
    alertMsg(type,message = '操作成功！') {
      if(type == 's') {
        this.$message({
          message,
          type: 'success'
        });
      } else {
        this.$message.error('系统繁忙！');
      }
    },
    setParm() {
      //translate 意图的偏移
      //temp 意图的缓存数组
      //temp2 下一个节点的缓存数组
      //temp3 路径的缓存数组
      let translate = 60, translate2 = 20,  temp = [], temp2 = [], temp3=[]
      for(let i = 0; i < this.intention.length; i++) {
        // 意图的宽度
        const width = document.getElementById('intention_text_'+this.intention[i].seqId).clientWidth
        if (i != 0) {
          const preWidth = document.getElementById('intention_text_'+this.intention[i-1].seqId).clientWidth
          translate = translate + preWidth + 80
        }
        temp.push({
          width,
          translate,
          ...this.intention[i]
        })

        let desc_temp = []
        for (let j = 0; j < this.flowList.length; j++) {
          if(this.intention[i].nextProcessId == this.flowList[j].seqId) {
            const flow = this.flowList[j]
            const width2 = document.getElementById('next_text_'+this.flowList[j].seqId).clientWidth
            const descLineNum = Math.ceil(this.flowList[j].processDesc.length / 16)
            const height = (descLineNum + 2)*30
            if(i != 0) {
              console.log('nextProcessId', this.intention[i-1].nextProcessId)
              const preWidth = document.getElementById('next_text_'+this.intention[i-1].nextProcessId).clientWidth
              translate2 = translate2 + preWidth + 25
            }

            for(let k =0; k < descLineNum; k++) {
              desc_temp.push(this.flowList[j].processDesc.slice(k*16,k*16+16))
            }
            temp2.push({
              width:width2,
              translate:translate2,
              ...this.flowList[j],
              desc_temp,
              height
            })

            temp3.push({
              width:width,
              width2:width2,
              translateFrom:translate,
              translateTo:translate2
            })
          }
        }
      }


      this.intentNodeParm = temp
      this.nextNodeParm = temp2
      this.pathParm = temp3
    }
  }
}
</script>
