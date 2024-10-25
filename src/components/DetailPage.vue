<template>
  <v-container class="mt-5">
    <v-row justify="end" align="center">
      <v-col cols="12" sm="12" md="3">
        <v-select
          v-model="databaseName"
          label="SalesTools Country"
          :items="databases"
          :disabled="isSearching"
          item-title="text"
          item-value="key"
          variant="solo-filled"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-row align="center">
          <v-col cols="10">
            <v-textarea
              v-model="searchQuery"
              label="Orders No"
              prepend-icon="mdi-file-document-multiple-outline"
              outlined
              :counter="2000"
              :rows="2"
              maxlength="2000"
              :disabled="isSearching"
              variant="outlined"
              class="fill-width"
            ></v-textarea>
          </v-col>
          <v-col cols="2" class="d-flex justify-center">
            <v-btn icon color="primary" @click="handleButtonClick" class="ma-2" small>
              <v-icon>{{ isSearching ? 'mdi-close' : 'mdi-magnify' }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
      <!-- Added a new column that pushes the cancel button to the far right -->
      <v-col cols="12" md="2" class="d-flex justify-end" v-if="selectedOrders.length > 0">
        <v-btn
          icon
          color="red"
          @click="sendCancelOrders(selectedOrders)"
          class="ma-2"
          small
        >
          <v-icon>mdi-book-cancel-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Show toolbar when there are no orders -->
    <v-row v-if="orders.length === 0" class="mt-2" justify="center" align="center">
      <v-col cols="12">
        <v-toolbar color="#f8c849" dark flat>
          <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" class="text-center">
              <span style="font-size: larger">no data available</span>
            </v-col>
          </v-row>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-data-table
      v-if="orders.length > 0"
      :items="orders"
      item-value="sT_Order"
      v-model="selectedOrders"
      show-select
      :headers="headers"
      class="elevation-1 text-center"
    >
      <template v-slot:top>
        <v-toolbar flat class="custom-toolbar">
          <v-toolbar-title>Orders</v-toolbar-title>
        </v-toolbar>
      </template>

    </v-data-table>
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">Loading... {{ loadingNumber }}%</div>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "DetailPage",
  data() {
    return {
      databaseName: "SALESTOOLS_IP1",
      databases: [
        { key: "SALESTOOLS_IP1", text: "Thailand" },
        { key: "SALESTOOLS_IPV", text: "Vietnam" },
        { key: "SALESTOOLS_IPMM", text: "Myanmar" },
      ],
      loading: false,
      loadingNumber: 0,
      intervalId: null,
      Endpoint: "https://salestools.ip-one.com/ApiCancelOrders",
      searchQuery: "",
      isSearching: false, // สถานะว่ากำลังค้นหาหรือไม่
      orders: [],
      selectedOrders: [],
      headers: [
          {
            title: 'ST Order',
            align: 'center',
            key: 'sT_Order',
          },
          { title: 'SAP Order', align: 'center', key: 'saP_Order' },
          { title: 'Ref Do', align: 'center', key: 'refDO' },
          { title: 'Ref Invoice', align: 'center', key: 'refInvoice' },
          { title: 'Flag SAP', align: 'center', key: 'flagSAP' },
          { title: 'Approve Status', align: 'center', key: 'approverStatus' },
          { title: 'Canceled', align: 'center', key: 'canceled' },
          { title: 'Order Type', align: 'center', key: 'orderType' },
          { title: 'Credit Check', align: 'center', key: 'creditCheck' },
          { title: 'Sale Code', align: 'center', key: 'saleCode' },
          { title: 'Depot', align: 'center', key: 'depot' },
          { title: 'Sale Type', align: 'center', key: 'saleType' },
        ],
    };
  },
  methods: {
    async getOrderById(val) {
      this.loading = true;
      this.startLoadingCount();
      const pData = {
        ordersID: val.replace(/\s/g, ""),
        databaseName: this.databaseName,
      };
      try {
        const response = await axios.post(
          ` ${this.Endpoint}/api/CancelBill/v1/GetOrderListById`,
          pData
        );
        if (response.data.status === 200) {
          this.orders = response.data.results;
          this.isSearching = true;
          this.loading = false; // ซ่อน loading เมื่อถึง 100%
          this.loadingNumber = 0;
          clearInterval(this.intervalId);
        } else {
          this.loading = false; // ซ่อน loading เมื่อถึง 100%
          this.loadingNumber = 0;
          clearInterval(this.intervalId);
          Swal.fire({
            text: "Orders not found.",
            icon: "warning",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonColor: "#0c80c4",
            cancelButtonColor: "#C0C0C0",
            confirmButtonText: "Ok",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async sendCancelOrders(val) {
      Swal.fire({
        html: "Would you like to save?",
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.startLoadingCount();
          const resultJoin = val.sort().join(",");
          const pData = {
            ordersID: resultJoin.replace(/\s/g, ""),
            databaseName: this.databaseName,
          };
          try {
            const response = await axios.post(
              ` ${this.Endpoint}/api/CancelBill/v1/CancelOrderById`,
              pData
            );
            if (response.data.status === 200) {
              this.loading = false; // ซ่อน loading เมื่อถึง 100%
              this.loadingNumber = 0;
              clearInterval(this.intervalId);
              Swal.fire({
                html: "Successfully",
                icon: "success",
                showCancelButton: false,
                allowOutsideClick: false,
                confirmButtonColor: "#0c80c4",
                cancelButtonColor: "#C0C0C0",
                confirmButtonText: "OK",
                // eslint-disable-next-line no-shadow
              }).then(async (result) => {
                if (result.isConfirmed) {
                  this.clearSearch();
                }
              });
            }
          } catch (error) {
            this.loading = false; // ซ่อน loading เมื่อถึง 100%
            this.loadingNumber = 0;
            clearInterval(this.intervalId);
            Swal.fire({
              text: "Internal Server Error",
              icon: "error",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            });
          }
        }
      });
    },
    // eslint-disable-next-line consistent-return
    handleButtonClick() {
      if (this.isSearching) {
        // ถ้าอยู่ในสถานะกำลังค้นหา ให้ล้างข้อมูลและรีเซ็ต
        this.clearSearch();
      } else {
        // ถ้ากดค้นหา ให้ทำการค้นหา
        if (this.searchQuery.length === 0) {
          return Swal.fire({
            text: "Please enter the OrderNo or SAPDoc.",
            icon: "warning",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonColor: "#0c80c4",
            cancelButtonColor: "#C0C0C0",
            confirmButtonText: "Ok",
          });
        }
        this.getOrderById(this.searchQuery.trim());
      }
    },
    clearSearch() {
      this.orders = [];
      this.selectedOrders = [];
      this.searchQuery = ""; // ล้างข้อมูลในช่อง input
      this.isSearching = false; // รีเซ็ตสถานะการค้นหา
      this.loadingNumber = 0;
      this.databaseName = "SALESTOOLS_IP1";
    },
    startLoadingCount() {
      this.intervalId = setInterval(() => {
        if (this.loadingNumber < 99) {
          this.loadingNumber += 1;
        }
      }, 100); // เพิ่มเลขทุก ๆ 100ms
    },
  },
};
</script>

<style>
.fill-width {
  width: 100%;
}
.v-data-table-header th {
  background-color: #3f51b5 !important;
  color: white !important;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

.loading-text {
  margin-top: 20px;
  font-size: 20px;
  color: #333;
}

.v-data-table {
  border-radius: 0px 0px 10px 10px !important;
}

.v-data-table__th{
  background: linear-gradient(90deg, rgba(0,127,196,1) 0%, rgba(0,127,196,1) 35%, rgba(0,127,196,1) 100%) !important;
  color: white !important;
}

.custom-toolbar {
  background: linear-gradient(360deg, rgba(255,219,122,1) 0%, rgba(248,200,73,1) 35%, rgba(240,176,6,1) 100%) !important;
  border-radius: 10px 10px 0px 0px !important;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
