<template>
    <div id="app">
        jkkk
        <litter :msg="msg" @todo="todo"></litter>
    </div>
</template>

<script>
import litter from '../components/litter'
export default {
    name: 'app',
    
    data() {
        return {
            msg:"传值到D"
        };
    },
    components:{ litter },
    methods: {
       todo(item){
           alert(item);
       }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
  
</style>