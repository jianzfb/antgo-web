<template>
    <div>
    <b-container>
        <div>
        <b-row align-h="center">
            <b-col>
                <b-dropdown text="过滤" class="m-md-2" variant="outline-primary" style="width: 150px">
                    <b-dropdown-item v-for="column in columns" :key="column">
                        {{column}}
                    </b-dropdown-item>
                </b-dropdown>
            </b-col>    
            <b-col style="display: flex; flex-direction: row; justify-content: center; align-content: center;flex-wrap: wrap;">
                <div class="m-md-2">
                    <b-badge pill variant="info" style="height: 30px; display: flex; flex-direction: column; justify-content: center;">
                        {{sample_num_completed}}/{{sample_num}}
                    </b-badge>
                </div>
            </b-col>  
            <b-col>
                <div style="float: right;">
                    <b-button variant="outline-primary"  class="m-md-2" style="width:100px" @click="showUploadWindow()">导入</b-button>
                    <b-button variant="outline-primary"  class="m-md-2" style="width:100px" @click="export_samples()">导出</b-button>
                    <b-button variant="danger"  class="m-md-2" style="width:100px" @click="finish_label()">完成</b-button>                    
                </div>
            </b-col>
        </b-row>
        <b-row style="height: 70px; width: auto;">
            <b-col>
                <div class="dm-table__cell">
                    <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                    <b-form-checkbox v-model="select_all"></b-form-checkbox>
                    </div>
                </div>
            </b-col>
            <b-col v-for="head in heads" :key="head">
                <div class="dm-table__cell">
                    <div style="width: 110px;display: flex;height: 100%;align-items: center;">
                    {{head}}
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-row v-for="(sample, sample_i) in samples" :key="sample_i" class="row_activate" style="cursor: pointer">
            <b-col style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center;">
                <div class="dm-table__cell">
                    <div style="width: 40px;display: flex;height: 100%;align-items: center;">
                    <b-form-checkbox v-model="sample['selected']"></b-form-checkbox>
                    </div>
                </div>
            </b-col>
            <b-col @click="enter(sample, sample_i)" style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center;">
                <div class="dm-table__cell">
                    <div style="width: 110px;display: flex;height: 100%;align-items: center;">
                    <div style="width: 180px; justify-content: space-between; display: flex; height: 100%; align-items: center;">
                    {{sample_i}}
                    </div>
                    </div>
                </div>
            </b-col>            
            <b-col @click="enter(sample, sample_i)" style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center;">
                <div class="dm-table__cell">
                    <div style="width: 110px;display: flex;height: 100%;align-items: center;">
                    <div v-if="sample['state'] == 'completed'" style="width: 180px; justify-content: space-between; display: flex; height: 100%; align-items: center;">
                    {{sample['completed_time']}}
                    </div>
                    </div>
                </div>
            </b-col>
            <b-col @click="enter(sample, sample_i)" style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center;">
                <div class="dm-table__cell">
                    <div style="width: 110px;display: flex;height: 100%;align-items: center;">
                        <div style="width: 180px; justify-content: space-between; display: flex; height: 100%; align-items: center;">
                        {{sample['label_info'].length}}
                        </div>
                    </div>
                </div>
            </b-col>
            <b-col @click="enter(sample, sample_i)" style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center;">
                <div class="dm-table__cell">
                    <div style="width: 110px;display: flex;height: 100%;align-items: center;">
                        <div style="width: 180px; justify-content: space-between; display: flex; height: 100%; align-items: center;">

                        <div class="lsf-space lsf-space_direction_horizontal lsf-space_size_small" v-for="(operator, operator_i) in sample['operator']" :key="operator_i">
                            <div block="lsf-annotations-list" class="lsf-userpic lsf-annotations-list__userpic" style="background: rgb(179, 218, 216); color: rgb(0, 0, 0);">
                                <img :alt="operator['full_name']" class="lsf-userpic__avatar" style="opacity: 0;">
                                <span class="lsf-userpic__username">{{operator['short_name']}}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

            </b-col>
            <b-col @click="enter(sample, sample_i)" style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center;">
                <div class="dm-table__cell">
                    <div style="width: 110px;display: flex;height: 100%;align-items: center;">

                        <img :src="sample['image_file']" width="40" height="40">

                    </div>
                </div>
            </b-col>
            <b-col style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center;">
                <div class="dm-table__cell">
                    <div style="width: 110px;display: flex;height: 100%;align-items: center;">
                        <b-icon icon="code-slash" scale="1" variant="info" style="cursor: pointer"></b-icon>
                    </div>
                </div>
            </b-col>
        </b-row>
        </div>
    </b-container>
        <input type="file" ref="file_control" @change="selectedFile" style="display: none">
    </div>
</template>

<script>
    export default {
    name:'Project',
    data() {
        return {
            columns:[],
            heads:[
                'ID',
                '完成时间',
                '标注数',
                '人员',
                '图像',
                '信息'
            ],
            samples:[],            
            select_all: false,
            now_page: 0,
            more_show: true,
            sample_num_completed: 0,
            sample_num: 0,
        };
    },
    mounted: function(){
        var _this = this;
        this.axios.get('/antgo/api/info/').then(function(res){
            var stage = res.data.content['project_state']['stage'];
            if(stage != 'labeling'){
                // 当前页面显示等待页面，并显示状态信息（不可进行任何点击等标注工作）                
                _this.$router.push({
                    path: '/'
                })
            }
            else{
                // 获取当前标注状态
                _this.sample_num_completed = res.data.content['project_state']['sample_num_completed']
                _this.sample_num = res.data.content['project_state']['sample_num']
                // 加载初始列表
                _this.scrollMore();
            }
        }).catch(function(error){
            // do nothing
        })

        // 监听，滚动后加载后续样本列表
        window.addEventListener('scroll', () => {
            const scrollY = document.documentElement.scrollTop || document.body.scrollTop // 滚动条在Y轴上的滚动距离
            const vh = document.compatMode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight // 页面的可视高度（能看见的）
            const allHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) // 页面的总高度（所有的）
            if (scrollY + vh >= allHeight) { // 当滚动条滑到页面底部
                this.scrollMore()
            }
        })
    },
    methods: {
        enter: function(sample, sample_i){
            this.$router.push({path: '/project/'+sample_i});
        },
        scrollMore() { 
            // 滚动加载更多
            var _this = this;
            _this.axios.get(
                '/antgo/api/label/sample/',
                {
                    params:{
                        page_index: _this.now_page,
                        page_size: 50
                    }
                }
            ).then(function(res){
                var total_num = res.data.content['total_sample_num'];
                for(var i in res.data.content['page_samples']){
                    _this.samples.push(res.data.content['page_samples'][i])
                }
                if(_this.samples.length < total_num){
                    _this.more_show = true;
                }
                else{
                    _this.more_show = false;
                }
                _this.now_page += 1;
            }).catch(function(error){
                // do nothing
            })            
        },        
        export_samples: function(){
            this.axios({
                method: 'get',
                url: '/antgo/api/label/export/',
                responseType: 'blob'
            }).then(response => {
                this.download(response)
            }).catch((error) => {

            })
        },
        download: function(data) {
            if (!data) {
                return
            }
            let file_name = data.headers['content-disposition'].split(";")[1].split("=")[1];
            let url = window.URL.createObjectURL(data['data']);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', file_name);
            
            document.body.appendChild(link);
            link.click()
        },
        selectedFile:function(){
            let file = this.$refs.file_control.files[0];
            var input_file_name = file.name;
            //判定文件的后缀
            let index = input_file_name.lastIndexOf(".");
            let suffix = input_file_name.substring(index+1);
            if(suffix != 'json'){
                return
            }

            // alert(input_file_name)
            // 提交到后台
            // this.$emit('fileselected',file);
        },
        showUploadWindow:function(){
            console.log('hello')
            this.$refs.file_control.dispatchEvent(new MouseEvent('click'));
        },   
        finish_label: function(){
            var _this = this;
            let params = new FormData();  
            params.append('running_state', 'running')
            params.append('running_stage', 'finish')

            _this.axios.post(
                '/antgo/api/info/', params).then(function(res){
                // 成功更新
                if(!res.data.content['finish']){
                    alert('没有完成所有样本标注')
                }
                else{
                    _this.$router.push({path: '/'})
                }
            }).catch(function(error){
                // do nothing
                console.log(error)
            })    
        }     
    }
    };
</script>

<style scoped>
.dm-table__cell {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex: 150 0 auto;
    max-width: min-content;
    min-width: min-content;
    overflow: hidden;
    padding: 10px;
    position: relative;
    width: fit-content;
    word-break: break-word;
}
.row_activate{
}
.row_activate:hover{
    background-color: #0000ff26
}
.lsf-space_direction_horizontal {
    align-items: center;
    grid-auto-flow: column;
}
.lsf-space_size_small {
    grid-gap: 8px;
}
.lsf-space {
    grid-gap: 16px;
    display: grid;
}
.lsf-userpic {
    align-items: center;
    background: #f5f5f5;
    border-radius: 13.5px;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
    display: flex;
    height: 28px;
    justify-content: center;
    overflow: hidden;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 28px;
}
.lsf-userpic img {
    font-size: 12px;
    height: 100%;
    line-height: 22px;
    -o-object-fit: cover;
    object-fit: cover;
    opacity: 0;
    position: absolute;
    width: 100%;
}
.lsf-annotations-list__create, .lsf-annotations-list__entity {
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 48px;
    padding: 0 16px;
}
.lsf-userpic__username {
    display: block;
    font-family: Roboto;
    font-size: 12px;
    font-weight: 700;
    line-height: 22px;
    opacity: .4;
}
.lsf-space_direction_vertical {
    grid-auto-flow: row;
    grid-auto-rows: -webkit-max-content;
    grid-auto-rows: max-content;
    justify-content: center;
}
.lsf-space_collapsed, .lsf-space_size_none {
    grid-gap: 0;
}
.lsf-annotations-list__user {
    display: flex;
    font-size: 14px;
    line-height: 16px;
    max-width: 165px;
}
.lsf-annotations-list__name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.lsf-annotations-list__entity-id {
    flex: none;
    font-size: 11px;
    opacity: .5;
    padding-left: 5px;
}
.lsf-annotations-list__created {
    color: rgba(0,0,0,.4);
    font-size: 11px;
    line-height: 13px;
}
.mask{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 2000;
}
.page-center{
    position: absolute;
    width: 100%;
    top: 50%;
}
</style>