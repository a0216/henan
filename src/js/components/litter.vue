<template>
    <div class="content">
        组件1
        <p v-html="msg" @click="dosame"></p>
    </div>
</template>

<script>
export default {
    name: 'litter',
    props:{
        msg:{
            type:String,
            default:''
        }
    },
    data() {
        return {

        };
    },
   
    methods: {
       dosame(){
           this.$emit('todo', 3)
       }
    },
    mounted(){
        console.log(this.msg)
    }
}
</script>

<style lang="less" rel="stylesheet/less">
  
</style>