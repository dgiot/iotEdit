<!--
 * @Author: h7ml
 * @Date: 2021-02-02 17:52:06
 * @LastEditTime: 2021-03-15 12:42:33
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\views\equipment_management\platform_overview.vue
-->
<template>
  <div class="home_index">
    <div ref="platform" class="platform" >
      <el-button class="editAmis" @click="handleToEdit">编辑</el-button>
      <div class="dashboard_check" v-if="konvaList.length > 1">
        <div
          class="screen_check_item"
          style="font-size: 1em"
          :class="item.objectId == viewId ? 'screen_select' : 'screen_unselect'"
          v-for="(item, index) in konvaList"
          :key="item.objectId + index"
          @click="handleToCheckout(item)"
        >
          {{ item.title }}
        </div>
      </div>
      <topo
        v-if="showType === 'Konva'"
        :code="viewData.konva"
        :object-id="viewId"
      />
    </div>
  </div>
</template>
<script>
  import { queryRelation } from '@/api/Relation'
  import { mapGetters, mapMutations } from 'vuex'
  import { isBase64 } from '@/utils'
  import topo from '@/views/CloudFunction/lowcode/components/dgiotKonva'

  window.dgiot.dgiotEnv = process.env
  export default {
    name: 'Home',
    components: {
      topo,
    },
    data() {
      return {
        konvaList: [],
        showType: '',
        lineList: [],
        ak: this.$dgiot.secret.baidu.map,
      }
    },
    computed: {
      ...mapGetters({
        objectId: 'user/objectId',
        roleTree: 'user/roleTree',
        collapse: 'settings/collapse',
        _Product: 'user/_Product',
        language: 'settings/language',
        _dev_count: 'dashboard/_dev_count',
        _project_count: 'dashboard/_project_count',
        _app_count: 'dashboard/_app_count',
        _product_count: 'dashboard/_product_count',
        token: 'user/token',
        _dev_online_count: 'dashboard/_dev_online_count', //在线设备
        _onlineData: 'dashboard/_onlineData',
        _dev_off_count: 'dashboard/_dev_off_count', //离线设备
        _offlineData: 'dashboard/_offlineData',
        _ChartStatus: 'dashboard/_ChartStatus',
        _tableData: 'dashboard/_tableData',
        _pcimg: 'dashboard/_pcimg',
        _role: 'acl/role',
        _mimg: 'dashboard/_mimg',
        mqttInfo: 'mqttDB/mqttInfo',
        treeFlag: 'settings/treeFlag',
      }),
    },
    watch: {
      treeFlag: {
        handler: function (newVal) {
          if (newVal) this.mapWidth = window.innerWidth * 0.77 + 'px'
          else this.mapWidth = window.innerWidth * 0.98 + 'px'
        },
        deep: true,
        limit: true,
      },
    },
    async mounted() {
      // let _this = this

      let destId =
        JSON.parse(Base64.decode(localStorage.getItem('role')))?.vuexinfo[0]
          ?.objectId || ''
      const { results = [] } = await queryRelation({
        destClass: '_Role',
        destId: destId,
        destField: 'views',
        srcClass: 'View',
      })
      let list = []
      let isFirst = true
      results.forEach((item) => {
        if (item.type == 'Dashboard') {
          list.push(item)
          if (isFirst) {
            this.showType = 'Konva'
            this.viewData = item.data
            this.viewId = item.objectId
            isFirst = false
          }
        }
      })
      this.konvaList = list
    },
    async beforeDestroy() {
      //  取消订阅http请求写法,http需要在topic中加页面路由
      // await this.$unSubscribe(this.subtopic)
      // 取消订阅mqtt写法 2022-5-27 改为http写法
      // this.$dgiotBus.$emit('MqttUnbscribe', this.topicKey, this.subtopic)
    },

    activated() {
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    destroyed() {
      // this.resizeTheChart()
    },
    methods: {
      handleToEdit() {
        console.log('this.viewData', this.showType, this.type)
        if (this.showType == 'Konva') {
          this.$router.push({
            path: '/Topo',
            query: {
              viewid: this.viewId,
              dashboard: true,
              // productid: row.key || 'none',
            },
          })
        }
      },
      handleToCheckout(item) {
        this.viewData = item.data
        this.viewId = item.objectId
        this.showType = ''
        this.$nextTick(() => {
          this.showType = 'Konva'
        })
      },
      async initMapHeight() {
        this.mapHeight = window.innerHeight * 0.7 + 'px'
        this.mapWidth = window.innerWidth * 0.98 + 'px'
      },
      ...mapMutations({
        setTreeFlag: 'settings/setTreeFlag',
      }),
      change(e) {
        // dgiotlog.log(e)
        if (e) {
          $('.el-tree').css({
            height: '100px',
            display: 'block',
            'overflow-x': 'auto',
          })
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .editAmis {
    z-index: 999;
    position: fixed;
    top: 70px;
    right: 10px;
  }
  .dashboard_check {
    position: absolute;
    z-index: 999;
    top: 8px;
    left: 8px;
    display: flex;
    .screen_check_item {
      box-sizing: border-box;
      width: 10em;
      height: 2.8em;
      line-height: 2.8em;
      margin-right: 0.75em;
      text-align: center;
      color: #fff;
      text-shadow: 2px 3px 1px #000;
      cursor: pointer;
    }
    .screen_select {
      background-color: #00bcd5;
      // background: url('../../assets/bg/screen_select.png') no-repeat 100% 100%;
      background-size: cover;
    }
    .screen_unselect {
      background-color: #03050c;
      // background: url('../../assets/bg/screen_unselect.png') no-repeat 100% 100%;
      background-size: cover;
    }
  }
  .home_index {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .platform {
    box-sizing: border-box;
    // width: 100%;
    height: 94vh;
    position: fixed;
    // height: calc(100vh - #{$base-top-bar-height}* 3 - 25px);
    padding: 10px 10px 2px 10px;
    background-size: 100%;
    .bg_screen1 {
      // background: url('../../../../public/assets/bg/pageBg.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 20px;
  }

  ::v-deep .el-card__body {
    height: 100%;
  }
</style>
