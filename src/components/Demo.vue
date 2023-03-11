<template>
    <b-container style="margin-top: 30px">
    <b-row>
        <!-- left is about input content -->
        <b-col>
            <b-card class="mt-6" header="输入信息">
            <b-container>
                <b-row v-for="(input, input_i) in input_info" :key="input_i">
                    <b-col v-if="input['type'] == 'image'" style="margin-top: 20px">
                    <h5>{{input['name']}}</h5>
                    <b-form-file
                        v-model="input['value']"
                        :state="Boolean(input['status'] == 'finish')"
                        placeholder="拖拽文件至此..."
                        drop-placeholder="Drop file here..."
                        accept=".jpg, .png, .jpeg"
                        browse-text="打开"
                        @input="uploadfile(input_i)"
                    ></b-form-file>
                    <div class="mt-3">上传文件: {{ input['status']=='finish' ? input['value'].name + ' 完成': '' }}</div>

                    </b-col>

                    <b-col v-if="input['type'] == 'video'" style="margin-top: 20px">
                    <h5>{{input['name']}}</h5>
                    <b-form-file
                        v-model="input['value']"
                        :state="Boolean(input['status'] == 'finish')"
                        placeholder="拖拽文件至此..."
                        drop-placeholder="Drop file here..."
                        accept=".jpg, .png, .jpeg"
                        browse-text="打开"
                        @input="uploadfile(input_i)"
                    ></b-form-file>
                    <div class="mt-3">上传文件: {{ input['status']=='finish' ? input['value'].name + ' 完成' : '' }}</div>

                    </b-col>
                    <b-col v-if="input['type'] == 'text'">
                    <b-input-group :prepend="input['name']" class="mt-3">
                        <b-form-input v-model="input['value']"></b-form-input>
                    </b-input-group>                        
                    </b-col>
                    <!-- <b-col v-if="input['type'] == 'number'">

                    <b-input-group :prepend="input['name']" class="mt-3">
                        <b-form-input type="number" v-model="input['value']" :min="input['min']" :max="input['max']"></b-form-input>
                    </b-input-group>      
                    </b-col> -->
                    <b-col v-if="input['type'] == 'slider'" style="margin-top: 20px">
                    <h5>{{input['name']}} {{input['value']}}</h5>
                    <b-input-group :prepend="input['min']" :append="input['max']" class="mt-3">
                        <b-form-input type="range" v-model="input['value']" :min="input['min']" :max="input['max']"></b-form-input>
                        <!-- {{input['value']}} -->
                    </b-input-group>                    
                    </b-col>
                    <b-col v-if="input['type'] == 'checkbox'" style="margin-top: 20px">
                    <b-form-checkbox v-model="input['value']" value=1 unchecked-value=0>{{input['name']}}</b-form-checkbox>  
                    </b-col>
                    <b-col v-if="input['type'] == 'select'" style="margin-top: 20px">
                    <h5>{{input['name']}}</h5>
                    <b-form-select v-model="input['value']" :options="input['options']"></b-form-select>
                    </b-col>
                </b-row>
            </b-container>
            </b-card>
        </b-col>

        <!-- right is about output content -->
        <b-col>
            <b-card class="mt-6" header="输出信息">
            <b-container>
                <b-row v-for="(output, output_i) in output_info" :key="output_i">
                    <b-col v-if="output['type'] == 'image'" style="margin-top: 20px">
                    <div style="margin-top: 20px">
                        <h5>{{output['name']}}</h5>
                        <b-img :src="output['value']" style="max-width: 512px;"></b-img>
                    </div>                        
                    </b-col>
                    <b-col v-if="output['type'] == 'text'">
                        <b-input-group :prepend="output['name']" class="mt-3">
                            <b-form-input v-model="output['value']"></b-form-input>
                        </b-input-group>      
                    </b-col>
                    <b-col v-if="output['type'] == 'number'">
                        <b-input-group :prepend="output['name']" class="mt-3">
                            <b-form-input type="number" v-model="output['value']"></b-form-input>
                        </b-input-group>                          
                    </b-col>
                </b-row>
            </b-container>
            </b-card>
        </b-col>
    </b-row>
    <b-row style="margin-top: 50px">
        <b-button  variant="primary" style="width:100px" @click="submit()">提交</b-button>
    </b-row>
    </b-container>
</template>

<script>
export default{
    name: 'Demo',
    data(){
        return {
            input_info: [
                // {
                //     'type': 'text', // text, number, image, video, 
                //     'name': 'hello',
                //     'value': 'w'
                // },
                // {
                //     'type': 'image',
                //     'name': '111',
                //     'value': '',
                //     'status': 'default', // default, uploading, finish
                // },
                // {
                //     'type': 'video',        
                //     'name': '222',
                //     'value': '',            
                //     'status': 'defalut'
                // },
                // {
                //     'type': 'slider',
                //     'name': 'hello',
                //     'value': 5,
                //     'min': 1,
                //     'max': 10,
                // },
                // {
                //     'type': 'checkbox',
                //     'name': 'world',
                //     'value': 1,
                // },
                // {
                //     'type': 'select',
                //     'name': 'yyy',
                //     'value': 'B',
                //     'options': [{'value': 'A', 'text': 'xxx'}, {'value': 'B', 'text': 'yyyy'}]
                // }
            ],
            output_info: [
                // {
                //     'type': 'text', // text, number, image, video, file
                //     'name': 'hh',
                //     'value': 'bb'
                // },
                // {
                //     'type': 'number',
                //     'name': 'world',
                //     'value': 0
                // },
                // {
                //     'type': 'image',
                //     'name': '/static/1.png',
                //     'value': '/assets/1.jpeg',
                // },
            ]
        }
    },
    mounted: function(){
        var _this = this;
        _this.axios.get('/antgo/api/demo/query_config/').then(function(res){
            _this.input_info = res.data
        }).catch(function(error){
            // do nothing
            console.log(error)
        })

    },
    methods:{
        uploadfile: function(input_i){
            // 1.step 修改数据状态
            this.input_info[input_i]['status'] = 'uploading'

            // 2.step 上传
            var formData = new FormData();//新建表单对象
                formData.append("file",this.input_info[input_i].value);//把文件对象添加到表单对象里
                formData.append("filename", this.input_info[input_i].value.name);//把文件名称添加到表单对象里

            var _this = this;
            // 此时可以自行将文件上传至服务器
            _this.axios.post("/antgo/api/demo/upload/",formData).then((res) => {
                _this.input_info[input_i]['status'] = 'finish';
                _this.$forceUpdate()
            })
        },
        submit: function(){
            var query_info = []
            for(var index in this.input_info){
                if(this.input_info[index]['type'] == 'image' || this.input_info[index]['type'] == 'video'){
                    // file id
                    query_info.push(this.input_info[index]['value'].name)
                }
                else{
                    query_info.push(this.input_info[index]['value'])
                }
            }

            var _this = this;
            let params = new FormData();  
            params.append('query', JSON.stringify(query_info))

            _this.axios.post(
                '/antgo/api/demo/submit/',
                params
            ).then(function(res){
                // query 成功，获得返回并显示
                _this.output_info = res.data;
            })
        }
    }
}
</script>

<style scoped>
</style>