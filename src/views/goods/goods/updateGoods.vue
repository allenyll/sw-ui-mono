<template>
  <goods-detail :is-edit="true"/>
</template>
<script>
import GoodsDetail from './components/goodsDetail'

export default {
  name: 'UpdateGoods',
  components: { GoodsDetail }
}
</script>
