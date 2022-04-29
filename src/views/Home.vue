<template>
    <div>
        <h1>
            this is a home
        </h1>
    </div>
</template>

<script>
    import Aside from "../components/Aside";
    import Header from "../components/Header";
    export default {
        name: "Home",
        data() {
            return {
                collapseBtnClass: 'el-icon-s-fold',
                isCollapse: false,
                sideWidth: 200,
                logoTextShow: true,
            }
        },
        components: {
            Aside,
            Header
        }
    }
</script>

<style scoped>

</style>