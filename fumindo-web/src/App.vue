<script setup lang="ts">
import { onMounted, ref } from "vue";

import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Select from "primevue/select";

import {
  createAsset,
  deleteAsset as removeAsset,
  getAssets,
  updateAsset,
  type Asset,
  type AssetCategory,
} from "./services/asset.service";

interface AssetForm {
  asset_name: string;
  stock_quantity: number | null;
  category: AssetCategory | null;
}

const assets = ref<Asset[]>([]);

const dialogVisible = ref(false);
const editingAsset = ref<Asset | null>(null);

const form = ref<AssetForm>({
  asset_name: "",
  stock_quantity: 0,
  category: null,
});

const categories: AssetCategory[] = ["Consumable", "Non-consumable"];

async function loadAssets() {
  try {
    assets.value = await getAssets();
  } catch (error) {
    console.error("Failed to load assets:", error);
  }
}

function openCreateDialog() {
  editingAsset.value = null;

  form.value = {
    asset_name: "",
    stock_quantity: 0,
    category: null,
  };

  dialogVisible.value = true;
}

function openEditDialog(asset: Asset) {
  editingAsset.value = asset;

  form.value = {
    asset_name: asset.asset_name,
    stock_quantity: asset.stock_quantity,
    category: asset.category,
  };

  dialogVisible.value = true;
}

async function saveAsset() {
  if (
    !form.value.asset_name.trim() ||
    form.value.stock_quantity === null ||
    !form.value.category
  ) {
    return;
  }

  const payload = {
    asset_name: form.value.asset_name.trim(),
    stock_quantity: form.value.stock_quantity,
    category: form.value.category,
  };

  try {
    if (editingAsset.value) {
      await updateAsset(editingAsset.value.asset_id, payload);
    } else {
      await createAsset(payload);
    }

    dialogVisible.value = false;

    await loadAssets();
  } catch (error) {
    console.error("Failed to save asset:", error);
  }
}

async function deleteAsset(asset: Asset) {
  const confirmed = window.confirm(`Delete "${asset.asset_name}"?`);

  if (!confirmed) {
    return;
  }

  try {
    await removeAsset(asset.asset_id);

    await loadAssets();
  } catch (error) {
    console.error("Failed to delete asset:", error);
  }
}

onMounted(() => {
  loadAssets();
});
</script>

<template>
  <main class="page">
    <div class="container">
      <div class="header">
        <div>
          <h1>Asset Management</h1>
          <p>Manage company assets</p>
        </div>

        <Button label="Add Asset" icon="pi pi-plus" @click="openCreateDialog" />
      </div>

      <DataTable
        :value="assets"
        stripedRows
        paginator
        :rows="10"
        responsiveLayout="scroll"
        emptyMessage="No assets found."
      >
        <Column field="asset_id" header="ID" style="width: 80px" />

        <Column field="asset_name" header="Asset Name" />

        <Column field="stock_quantity" header="Stock" />

        <Column field="category" header="Category" />

        <Column header="Actions" style="width: 180px">
          <template #body="{ data }">
            <div class="actions">
              <Button
                label="Edit"
                icon="pi pi-pencil"
                severity="secondary"
                size="small"
                @click="openEditDialog(data)"
              />

              <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                size="small"
                @click="deleteAsset(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="dialogVisible"
      :header="editingAsset ? 'Edit Asset' : 'Add Asset'"
      modal
      :style="{ width: '450px' }"
    >
      <div class="form">
        <div class="field">
          <label for="asset_name"> Asset Name </label>

          <InputText
            id="asset_name"
            v-model="form.asset_name"
            placeholder="Enter asset name"
          />
        </div>

        <div class="field">
          <label for="stock_quantity"> Stock Quantity </label>

          <InputNumber
            id="stock_quantity"
            v-model="form.stock_quantity"
            :min="0"
            showButtons
          />
        </div>

        <div class="field">
          <label for="category"> Category </label>

          <Select
            id="category"
            v-model="form.category"
            :options="categories"
            placeholder="Select category"
            class="category-select"
          />
        </div>

        <div class="dialog-actions">
          <Button
            label="Cancel"
            severity="secondary"
            @click="dialogVisible = false"
          />

          <Button
            :label="editingAsset ? 'Update' : 'Save'"
            icon="pi pi-check"
            @click="saveAsset"
          />
        </div>
      </div>
    </Dialog>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #f8fafc;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  color: black;
}

.header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-weight: 600;
}

.field :deep(.p-inputtext),
.field :deep(.p-inputnumber),
.category-select {
  width: 100%;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>
