<template>
    <div >
        <div class="mt-3">
        <b-pagination v-model="page_index" pills :total-rows="page_num" :per-page="perPage" style="display: flex;flex-direction: row;justify-content: center;" @click.native="next_list()"></b-pagination>

        <div style="display: flex; flex-direction: row; justify-content: center;">
            <b-badge variant="success" style="margin-right: 10px">等待处理 {{waiting}}</b-badge>
            <b-badge variant="danger">完成处理 {{finished}}</b-badge>
        </div>
        <b-container>
            <b-row style="margin-bottom: 5px" v-for="(sample, sample_i) in result_list" :key="sample_i">
                <!-- variable name -->
                <b-col v-for="(elem, elem_i) in sample['data']" :key="elem_i" style="display: flex;justify-content: center;">
                        <div class="dm-table__cell" style="margin-top: 7px;">
                            <div style="width: 200px;display: flex;height: 100%;align-items: center;">
                                <div v-if="elem['type'] == 'IMAGE'">
                                    <img :src="elem['data']" :width="elem['width']" :height="elem['height']"/>
                                </div>
                                <div v-else>
                                    {{elem['data']}}
                                </div>
                            </div>
                        </div>
                </b-col>
            </b-row>
        </b-container>
        </div>

    </div>
</template>

<script>
export default{
    name: 'Predict',
    data(){
        return {
            num_in_page: 1,
            page_num: 1,
            page_index:1,
            dataset_name: '',
            sample_num_in_dataset: 0,
            current_dataset_name: '',
            result_num: 0,
            result_list: [],
            tags: [],
            waiting: 0,
            finished: 0,
            perPage: 1,
        }
    },
    mounted: function(){
        var _this = this;
        _this.axios.get('/antgo/api/predict/entry/').then(function(res){
            // _this.samples = res.data.content['value'];
            // _this.index = res.data.content['step'];
            // _this.tags = res.data.content['tags'];
            // _this.samples_num = res.data.content['samples_num'];
            _this.num_in_page = res.data.content['num_in_page'];
            _this.page_num = res.data.content['page_num'];
            _this.page_index = res.data.content['page_index']+1;
            _this.dataset_name = res.data.content['dataset_name'];
            _this.sample_num_in_dataset = res.data.content['sample_num_in_dataset'];
            _this.current_dataset_name = res.data.content['current_dataset_name'];
            _this.result_num = res.data.content['result_num'];
            _this.result_list = res.data.content['result_list'];
            _this.tags = res.data.content['tags'];
            _this.waiting = res.data.content['waiting'];
            _this.finished = res.data.content['finished'];


        }).catch(function(error){
            // do nothing
            console.log(error)
        })
    },
    methods:{
        next_list: function(){
            var _this = this;
            _this.axios.get('/antgo/api/predict/page/', {
                params:{
                    'page_index': _this.page_index - 1,
                    'dataset_name': _this.dataset_name[0]
                }
            }).then(function(res){
                // _this.samples = res.data.content['value'];
                // _this.index = res.data.content['step'];
                // _this.tags = res.data.content['tags'];
                // _this.samples_num = res.data.content['samples_num'];
                _this.num_in_page = res.data.content['num_in_page'];
                _this.page_num = res.data.content['page_num'];
                // _this.sample_num_in_dataset = res.data.content['sample_num_in_dataset'];
                // _this.current_dataset_name = res.data.content['current_dataset_name'];
                _this.result_num = res.data.content['result_num'];
                _this.result_list = res.data.content['result_list'];
                _this.tags = res.data.content['tags'];
                _this.waiting = res.data.content['waiting'];
                _this.finished = res.data.content['finished'];
            }).catch(function(error){
                // do nothing
                console.log(error)
            })
        },
    }
}
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
    padding: 5px;
    position: relative;
    width: fit-content;
    word-break: break-word;
}
</style>