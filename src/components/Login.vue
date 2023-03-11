<template>
        <b-container fluid style="width: 400px;margin-top: 50px">
            <b-row class="my-1">
                <b-col sm="3">
                    <label>用户名</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input v-model="username" type="text"></b-form-input>
                </b-col>
            </b-row>
            <b-row class="my-1">
                <b-col sm="3">
                    <label>密码</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input v-model="password" type="password"></b-form-input>
                </b-col>
            </b-row>    
            <b-row>
                <b-col sm="6">
                    <b-button variant="primary" @click="login">登录</b-button>

                </b-col>
                <b-col sm="6">
                    <b-button variant="primary" @click="logout">登出</b-button>

                </b-col>                
            </b-row>        

        </b-container>
</template>

<script>
    export default {
        name:'Login',
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            login: function(){
                var _this = this;
                _this.axios.get(
                '/antgo/api/user/login/', {
                    params:{
                        user_name: this.username,
                        user_password: this.password
                    }
                }).then(function(res){
                    _this.$router.push({path: '/'})
                }).catch(function(error){
                    // do nothing
                    console.log(error)
                })     
            },
            logout: function(){
                var _this = this;
                _this.axios.post('/antgo/api/user/logout/').then(function(res){

                    _this.username = ''
                    _this.password = ''
                }).catch(function(error){
                    // do nothing
                    console.log(error)
                })     
            }
        }
    }
</script>

<style scoped>

</style>