<template>
    <div class="wrapper">
        <div style="margin: 200px auto; background-color: #fff; width: 350px; height: 300px; padding: 20px; border-radius: 10px">
            <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>管 理 员 登 录</b></div>
            <el-form :model="user" :rules="rules" ref="userForm">
                <el-form-item prop="userId">
                    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.userId"></el-input>
                </el-form-item>
                <el-form-item prop="userPassword">
                    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.userPassword"></el-input>
                </el-form-item>
                <el-form-item style="margin: 10px 0; text-align: right">
                    <el-button type="primary" size="small"  autocomplete="off" @click="login">登录</el-button>
                    <!--<el-button type="warning" size="small"  autocomplete="off">注册</el-button>-->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                user: {},
                rules: {
                    userId: [
                        { required: true, message: '请输入ID', trigger: 'blur' },
                        { min: 0, max: 10, message: '至少输入一个字符', trigger: 'blur' }
                    ],
                    userPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 0, max: 20, message: '至少输入一个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            login() {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {  // 表单校验合法
                        this.request.post("http://localhost:80/users/adminLogin", this.user).then(res => {
                            if(!res) {
                                this.$message.error("您输入的管理员帐号或管理员密码错误")
                            } else {
                                this.$message.success("登录成功 欢迎您使用本系统")
                                clearTimeout(this.timer);  //清除延迟执行
                                this.timer = setTimeout(()=>{   //设置延迟执行
                                    this.$router.push("/manage/home")
                                },1000);
                            }
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .wrapper {
        height: 100vh;
        background-image: linear-gradient(to bottom right, #FC466B , #3F5EFB);
        overflow: hidden;
    }
</style>
