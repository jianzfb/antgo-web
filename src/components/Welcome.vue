<template>
<div>
    <b-jumbotron v-if="project_type == 'LABEL'">
        <template #header>ANTGO-主动标注平台</template>
        <template #lead>
            这是一个主动标注平台，目前平台正处在第{{label_project_state['round']}}轮挖掘（状态：{{label_project_state['stage']}}）。
        </template>
        <hr class="my-4">
        <p v-if="label_project_state['stage'] != 'labeling'">
            预计需要等待{{label_project_state['waiting_time_to_next_round']}}后，将要重新启动新一轮标注过程。
        </p>
        <b-button variant="primary" href="#">了解详情</b-button>
        <b-button v-if="is_ready" variant="primary" @click="enter_page()" style="margin-left:10px">进入</b-button>
    </b-jumbotron>
    <b-jumbotron v-if="project_type == 'BROWSER'">
        <template #header>ANTGO-数据浏览</template>
        <template #lead>
            这是一个数据浏览页面。
        </template>
        <b-button variant="primary" href="#">了解详情</b-button>
        <b-button variant="primary" @click="enter_page()" style="margin-left:10px">进入</b-button>

        <form v-if="need_input" style="margin-top:20px">
            <label for="range-1">输入样本解析文件:</label>
            <div class="form-group">
                <input class="form-control" type="text" v-model="user_input" placeholder="输入数据">
            </div>
        </form>

    </b-jumbotron>   
    <b-jumbotron v-if="project_type == 'PREDICT'">
        <template #header>ANTGO-模型预测</template>
        <template #lead>
            这是一个模型预测页面。
        </template>
        <b-button variant="primary" href="#">了解详情</b-button>
        <b-button variant="primary" @click="enter_page()" style="margin-left:10px">进入</b-button>
    </b-jumbotron>        
</div>
</template>

<script>
    export default {
        name:'Welcome',
        data(){
            return {
                project_type: '',
                label_project_state:{
                    round: -1,
                    state: '',
                    stage: '',
                    waiting_time_to_next_round: '',
                },
                is_ready: false,
                need_input: false,
                user_input: ""
            }
        },
        mounted: function(){
            var _this = this;
            _this.axios.get('/antgo/api/info/').then(function(res){
                _this.project_type = res.data.content['project_type'];
                if(_this.project_type == 'LABEL'){
                    // 标注欢迎页面
                    _this.label_project_state['round'] = res.data.content['project_state']['round'];
                    _this.label_project_state['state'] = res.data.content['project_state']['state'];
                    _this.label_project_state['stage'] = res.data.content['project_state']['stage'];
                    _this.label_project_state['waiting_time_to_next_round'] = res.data.content['project_state']['waiting_time_to_next_round'];
                    
                    _this.is_ready = true;
                    if(_this.label_project_state['stage'] != 'labeling'){
                        // 当前页面显示等待页面，并显示状态信息（不可进行任何点击等标注工作）                
                        _this.is_ready = false;
                    }                    
                }
                else if(_this.project_type == 'BROWSER'){
                    // 浏览欢迎页面
                    _this.need_input = res.data.content['project_state']['need_input'];
                }
                else if(_this.project_type == 'DEMO'){
                    // DEMO欢迎页面
                    _this.enter_page();
                }
                else{
                    _this.is_ready = true;
                }
            }).catch(function(error){
                console.log(error)
            }) 
        },
        methods: {
            enter_page: function(){
                if(this.project_type == 'LABEL'){
                    this.$router.push({
                        path: '/projects/'
                    })
                }
                else if(this.project_type == 'BROWSER'){
                    this.$router.push({
                        path: '/browser/',
                        query: {
                            input: this.user_input
                        }                    
                    })
                }
                else if(this.project_type == 'PREDICT'){
                    this.$router.push({
                        path: '/predict/'
                    })
                }
                else if(this.project_type == 'DEMO'){
                    this.$router.push({
                        path: '/demo/'
                    })
                }
            }
        }
    }

</script>

<style scoped>

</style>