<template>
    <div>
        <div style="margin: 10px 0">
            <el-input style="width: 200px" placeholder="请输入停车场ID" suffix-icon="el-icon-search" v-model="parkingId"></el-input>
            <el-input style="width: 200px" placeholder="请输入停车位状态" suffix-icon="el-icon-message" class="ml-5" v-model="spaceState"></el-input>
            <el-input style="width: 200px" placeholder="请输入车牌号" suffix-icon="el-icon-position" class="ml-5" v-model="carId"></el-input>
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
        </div>

        <div style="margin: 10px 0">
            <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
            <el-popconfirm
                    class="ml-5"
                    confirm-button-text='确定'
                    cancel-button-text='取消'
                    icon="el-icon-info"
                    icon-color="red"
                    title="您确定批量删除这些数据吗？"
                    @confirm="delBatch"
            >
                <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>

            <el-upload action="http://localhost:80/spaces/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
                <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>
            </el-upload>
            <el-button type="primary" @click="exp" class="ml-5">导出 <i class="el-icon-top"></i></el-button>

        </div>

        <el-table width=100vh :data="tableData" border stripe :header-cell-class-name="headerBg"  @selection-change="handleSelectionChange" >
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="spaceId" label="停车位ID" width="200"></el-table-column>
            <el-table-column prop="parkingId" label="停车场ID" width="200"></el-table-column>
            <el-table-column prop="spaceState" label="停车位当前状态" width="200"></el-table-column>
            <el-table-column prop="carId" label="车牌号" width="300"></el-table-column>
            <el-table-column label="操作"  width="334" align="center">
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='我再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="您确定删除吗？"
                            @confirm="del(scope.row.spaceId)"
                    >
                        <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding: 10px 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 8, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <el-dialog title="停车位信息" :visible.sync="dialogFormVisible" width="30%" >
            <el-form label-width="100px" size="small">
                <el-form-item label="停车位ID">
                    <el-input v-model="form.spaceId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="停车场ID">
                    <el-input v-model="form.parkingId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="停车位状态">
                    <el-input v-model="form.spaceState" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="车牌号">
                    <el-input v-model="form.carId" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        data() {
            return {
                tableData: [],
                total: 0,
                pageNum: 1,
                pageSize: 5,
                spaceId:"",
                parkingId: "",
                spaceState: "",
                carId: "",
                form: {},
                dialogFormVisible: false,
                multipleSelection: [],
                headerBg: 'headerBg'
            }
        },
        created() {
            // 请求分页查询数据
            this.load()
        },
        methods: {
            load() {
                this.request.get("http://localhost:80/spaces/page", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        parkingId: this.parkingId,
                        spaceState: this.spaceState,
                        carId: this.carId,
                    }
                }).then(res => {
                    console.log(res)
                    this.tableData = res.records
                    this.total = res.total
                })
            },
            save() {
                this.request.post("http://localhost:80/spaces", this.form).then(res => {
                    if (res) {
                        this.$message.success("保存成功")
                        this.dialogFormVisible = false
                        this.load()
                    } else {
                        this.$message.error("保存失败")
                    }
                })
            },
            handleAdd() {
                this.dialogFormVisible = true
                this.form = {}
            },
            handleEdit(row) {
                this.form = row
                this.dialogFormVisible = true
            },
            del(spaceId) {
                this.request.delete("http://localhost:80/spaces/" + spaceId).then(res => {
                    if (res) {
                        this.$message.success("删除成功")
                        this.load()
                    } else {
                        this.$message.error("删除失败")
                    }
                })
            },
            handleSelectionChange(val) {
                console.log(val)
                this.multipleSelection = val
            },
            delBatch() {
                let ids = this.multipleSelection.map(v => v.spaceId)  // [{}, {}, {}] => [1,2,3]
                this.request.post("http://localhost:80/spaces/del/batch", ids).then(res => {
                    if (res) {
                        this.$message.success("批量删除成功")
                        this.load()
                    } else {
                        this.$message.error("批量删除失败")
                    }
                })
            },
            handleExcelImportSuccess() {
                this.$message.success("导入成功")
                this.load()
            },
            exp() {
                window.open("http://localhost:80/spaces/export")
            },
            reset() {
                this.parkingId = ""
                this.spaceState = ""
                this.carId = ""
                this.load()
            },
            handleSizeChange(pageSize) {
                console.log(pageSize)
                this.pageSize = pageSize
                this.load()
            },
            handleCurrentChange(pageNum) {
                console.log(pageNum)
                this.pageNum = pageNum
                this.load()
            }
        }
    }
</script>

<style scoped>
    .headerBg {
        background: #eee!important;
    }
</style>