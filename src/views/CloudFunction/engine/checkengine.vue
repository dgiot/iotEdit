<template>
  <div class="checkengine">
    <!--基本信息-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="fonty-size: 16px">基本信息</span>
      </div>
      <div class="box-form">
        <el-form label-width="80px" :model="engineform">
          <el-form-item label="触发事件:">
            <span>{{ engineform.region }}</span>
          </el-form-item>
          <el-form-item label="规则SQL:">
            <span>{{ engineform.sql }}</span>
          </el-form-item>
          <el-form-item label="备注:">
            <span>{{ engineform.remarks }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!--度量指标-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>度量指标</span>
      </div>
      <div class="box-table">
        <el-table
          :data="engineData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          style="width: 100%"
        >
          <el-table-column label="节点" prop="node" />
          <el-table-column label="已命中" prop="matched" sortable width="180" />
          <el-table-column label="命中速度" prop="speed" sortable width="180" />
          <el-table-column label="最大命中速度" prop="speed_max" />
          <el-table-column label="5分钟平均速度" prop="speed_last5m" />
        </el-table>
      </div>
    </el-card>
    <!--响应动作-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>响应动作</span>
      </div>
      <div class="box-table">
        <el-table :data="rulesdata" style="width: 100%">
          <el-table-column label="类型" prop="name" width="180" />
          <el-table-column label="参数">
            <template #default="{ row }">
              <!-- <el-input type="textarea" :value="JSON.stringify(row.params,null,4)" rows="5" cols="10" readonly></el-input> -->
              <span>{{ row.params }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="度量指标">
            <template #default="{ row }">
              <ul>
                <li v-for="(items, index) in row.metrics" :key="index">
                  <span style="display: inline-block; width: 120px">
                    {{ items.node }}
                  </span>
                  <span class="type">{{ '成功:' + items.success }}</span>
                  <span class="type">{{ '失败:' + items.failed }}</span>
                </li>
                <li>
                  <span
                    style="
                      display: inline-block;
                      width: 120px;
                      margin-top: 20px;
                    "
                  >
                    合计
                  </span>
                  <span class="type">
                    {{ '成功:' + allsuccss(row.metrics) }}
                  </span>
                  <span class="type">
                    {{ '失败:' + allfailed(row.metrics) }}
                  </span>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
  import { getRuleDetail } from '@/api/Rules'

  export default {
    data() {
      return {
        engineform: {
          region: '',
          remarks: '',
          sql: '',
        },
        engineData: [],
        ruleid: '',
        rulesdata: [],
      }
    },
    mounted() {
      this.detailForRule()
    },
    methods: {
      detailForRule() {
        this.rulesdata = []
        this.ruleid = this.$route.query.id
        getRuleDetail(this.ruleid)
          .then((response) => {
            if (response.data) {
              this.engineform.region = response.data.for.join(',')
              this.engineform.remarks = response.data.description
              this.engineform.sql = response.data.rawsql
              this.engineData = response.data.metrics
              this.rulesdata = response.data.actions
            }
          })
          .catch((error) => {
            this.$message(error.error)
          })
      },
      allsuccss(row) {
        var success = 0
        row.map((items) => {
          success += items.success
        })
        return success
      },
      allfailed(row) {
        var failed = 0
        row.map((items) => {
          failed += items.failed
        })
        return failed
      },
    },
  }
</script>
<style lang="scss" scoped>
  .checkengine {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #f6f7fb;

    ::v-deep .el-card {
      box-sizing: border-box;
      padding: 20px;
      margin-bottom: 20px;
      color: #71737d !important;

      ::v-deep .el-card__header {
        border: 0;
      }

      ::v-deep .el-form-item__label {
        font-weight: 100 !important;
        color: #71737d !important;
        text-align: left;
      }

      ::v-deep .el-form-item__content {
        color: #71737d !important;
      }

      ::v-deep .type {
        margin-left: 20px;
      }
    }

    li {
      list-style: none;
    }

    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
