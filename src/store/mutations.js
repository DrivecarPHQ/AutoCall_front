// import { ADD_ITEMNUM, REMBER_ANSWER, REMBER_TIME, INITIALIZE_DATA } from './mutation-types'
import mutation from './mutation-types'

export default {
	[mutation.SELECT_TASK](state, data) {
		state.navName = data.navName
		state.secondNav = data.secondNav
		state.thirdNav = data.thirdNav
		state.phoneNum = data.phoneNum
		state.sex= data.sex
		state.phoneTime = data.phoneTime
		state.callState = data.callState
		state.holdingTime = data.holdingTime
	},
	[mutation.CHANGE_FIRST_PATH](state, data) {
		state.firstPath = data.firstPath
		state.firstUrl = data.url
		state.secondPath = ""
		state.thirdPath = ""
	},
	[mutation.CHANGE_SECOND_PATH](state, data) {
		state.secondPath = data.secondPath
		state.secondUrl = data.url
		state.thirdPath = ""
	},
	[mutation.CHANGE_THIRD_PATH](state, data) {
		state.thirdPath = data.thirdPath
	},
	[mutation.NAV_COLLAPSE](state, data) {
		state.isCollapse = !state.isCollapse
	},
	[mutation.SET_FLOW_LIST](state, data) {
		let begin, end
		data.flowList.forEach((item, index)=>{
			if(item.processType == 1) {
				begin = item
				data.flowList.splice(index,1)
			} else if(item.processType == 3) {
				end = item
				data.flowList.splice(index,1)
			}
		})
		if(data.flowList.length > 0) {
			data.flowList.unshift(begin)
			data.flowList.push(end)
		}
		state.flowList = data.flowList
	},
	[mutation.ADD_NODE](state, data) {
		state.flowList.splice(state.flowList.length - 1, 0, data.node)
	},
	[mutation.DELETE_NODE](state, data) {
	  state.flowList = state.flowList.filter((item, index) => {
	    return item.seqId != data.nodeIdSelected
	  })
	},
	[mutation.EDIT_NODE](state, data) {
		state.flowList = state.flowList.map((item)=>{
			if(item.seqId == data.nodeIdSelected) {
				return {
					...item,
					...data.form
				}
			} else {
				return {...item}
			}
		})
		state.flowList.forEach(function(item, index){
			if(item.id == data.nodeIdSelected) {
				item.flowName = that.form.name
				item.desc = that.form.desc
			}
		})
	},
	[mutation.SET_INTENTION](state, data) {
		state.intention = data.intention
	},
	[mutation.DELETE_INTENTION](state, data) {
		state.intention = state.intention.filter((item)=>{
			return item.seqId != data.seqId
		})
	},
	[mutation.ADD_INTENTION](state, data) {
		state.intention.push(data)
	},
	[mutation.EDIT_INTENTION](state, data) {
		state.intention = state.intention.map((item)=>{
			if(item.seqId == data.seqId) {
				return {
					...item,
					...data
				}
			} else {
				return {...item}
			}
		})
	}
}
