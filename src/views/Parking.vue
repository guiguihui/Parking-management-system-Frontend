<template>
    <div>
        <div style="margin: 10px 0">
            <el-input style="width: 200px" placeholder="请输入停车场名称" suffix-icon="el-icon-search" v-model="parkingName"></el-input>
            <el-input style="width: 200px" placeholder="请输入停车场地址" suffix-icon="el-icon-message" class="ml-5" v-model="parkingAddress"></el-input>
            <el-input style="width: 200px" placeholder="请输入收费标准" suffix-icon="el-icon-position" class="ml-5" v-model="parkingFee"></el-input>
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

            <el-upload action="http://localhost:80/parkings/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
                <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>
            </el-upload>
            <el-button type="primary" @click="exp" class="ml-5">导出 <i class="el-icon-top"></i></el-button>

        </div>

        <el-table width=100vh :data="tableData" border stripe :header-cell-class-name="headerBg"  @selection-change="handleSelectionChange" >
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="parkingId" label="ID" width="50"></el-table-column>
            <el-table-column prop="parkingName" label="停车场名称" width="200"></el-table-column>
            <el-table-column prop="parkingAddress" label="停车场地址" width="200"></el-table-column>
            <el-table-column prop="parkingSpace" label="总停车位" width="100"></el-table-column>
            <el-table-column prop="parkingAvailable" label="当前空余车位" width="105"></el-table-column>
            <el-table-column prop="parkingLatitude" label="停车场经度" width="100"></el-table-column>
            <el-table-column prop="parkingLongitude" label="停车场纬度" width="100"></el-table-column>
            <el-table-column prop="parkingFee" label="停车场收费标准" width="130"></el-table-column>

            <el-table-column label="操作"  width="250" align="center">
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='我再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="您确定删除吗？"
                            @confirm="del(scope.row.parkingId)"
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

        <el-dialog title="停车场信息" :visible.sync="dialogFormVisible" width="30%" >
            <el-form label-width="100px" size="small">
                <el-form-item label="停车场名称">
                    <el-input v-model="form.parkingName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="停车场地址">
                    <el-input v-model="form.parkingAddress" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="总停车位">
                    <el-input v-model="form.parkingSpace" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="前空余车位">
                    <el-input v-model="form.parkingAvailable" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="停车场经度">
                    <el-input v-model="form.parkingLatitude" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="停车场纬度">
                    <el-input v-model="form.parkingLongitude" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="收费标准">
                    <el-input v-model="form.parkingFee" autocomplete="off"></el-input>
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
                parkingId:"",
                parkingName: "",
                parkingAddress: "",
                parkingSpace: "",
                parkingAvailable: "",
                parkingLatitude:"",
                parkingLongitude:"",
                parkingFee:"",
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
                this.request.get("http://localhost:80/parkings/page", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        parkingName: this.parkingName,
                        parkingAddress: this.parkingAddress,
                        parkingFee: this.parkingFee,
                    }
                }).then(res => {
                    console.log(res)
                    this.tableData = res.records
                    this.total = res.total
                })
            },
            save() {
                this.request.post("http://localhost:80/parkings", this.form).then(res => {
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
            del(parkingId) {
                this.request.delete("http://localhost:80/parkings/" + parkingId).then(res => {
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
                let ids = this.multipleSelection.map(v => v.parkingId)  // [{}, {}, {}] => [1,2,3]
                this.request.post("http://localhost:80/parkings/del/batch", ids).then(res => {
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
                window.open("http://localhost:80/parkings/export")
            },
            reset() {
                this.parkingName = ""
                this.parkingAddress = ""
                this.parkingFee = ""
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