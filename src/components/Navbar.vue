<template>
<div>
    <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#">ANTGO {{project_type}}</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item v-if="project_type=='LABEL'" href="/#/projects/">Project /</b-nav-item>
                <b-nav-item v-if="project_type=='BROWSER'" href="/#/browser/">Project /</b-nav-item>
                <b-nav-item v-if="project_type=='PREDICT'" href="/#/predict/">Project /</b-nav-item>
                <b-nav-item href="#" disabled>{{project_name}}</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-navbar-nav>
                    <b-button @click="show_user_info()">{{short_name}}</b-button>
                </b-navbar-nav>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>

    <b-card title="用户信息" sub-title="" v-show="is_show_info">
        <b-card-text>
            {{full_name}}
        </b-card-text>
        <b-card-text>
            {{statistic_info}}
        </b-card-text>
        <b-button variant="primary" @click="close">关闭</b-button>
    </b-card>    

</div>
</template>
<script>
export default {
    name: 'Navbar',
    data() {
        return {
            project_name: '',
            project_type: '',
            short_name: '',
            full_name: '',
            statistic_info: '',
            is_show_info: false
        }
    },
    mounted: function(){
        var _this = this;
        this.axios.get('/antgo/api/user/info/').then(function(res){
            _this.project_name = res.data.content['task_name']
            _this.project_type = res.data.content['project_type']
            _this.short_name = res.data.content['short_name']
            _this.full_name = res.data.content['full_name']
        }).catch(function(error){
            // do nothing
            // 进入Login页面
            _this.$router.push({path: '/Login/'})
        }) 
    }, 
    methods: {
        show_user_info: function(){
            var _this = this;
            this.axios.get('/antgo/api/user/info/').then(function(res){
                var statistic_info = res.data.content['statistic_info'];
                _this.statistic_info = statistic_info;
                _this.is_show_info = true;

            }).catch(function(error){
                // do nothing
            }) 
        },
        close: function(){
            this.is_show_info = false;
        }
    }
}    
</script>