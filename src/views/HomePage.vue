<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title>Student Information System</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal">
            <ion-icon :icon="addOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar color="primary">
        <ion-searchbar v-model="searchQuery" placeholder="Search students..."></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-item :color="isOnline ? 'success' : 'danger'" lines="none">
        <ion-icon :icon="isOnline ? wifiOutline : cloudOfflineOutline" slot="start"></ion-icon>
        <ion-label>
          <h2>{{ isOnline ? 'Database Online' : 'Database Offline' }}</h2>
          <p>{{ isOnline ? 'Connected to Firebase' : 'No connection to Firebase' }}</p>
        </ion-label>
        <ion-button fill="clear" slot="end" @click="reconnect">
          <ion-icon :icon="refreshOutline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-item>

      <StudentList
        :students="filteredStudents"
        :search-query="searchQuery"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="confirmDelete"
        @add="openAddModal"
      />
    </ion-content>

    <StudentFormModal
      :is-open="showFormModal"
      :editing-student="editingStudent"
      @close="closeFormModal"
      @save="handleSave"
    />

    <StudentDetailModal
      :is-open="showViewModal"
      :student="viewingStudent"
      @close="closeViewModal"
      @edit="editFromView"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonButton,
  IonIcon, IonSearchbar, IonItem, IonLabel, alertController, toastController
} from '@ionic/vue';
import { addOutline, wifiOutline, cloudOfflineOutline, refreshOutline } from 'ionicons/icons';
import { useStudentStore, Student } from '../store/studentStore';
import StudentList from '@/components/StudentList.vue';
import StudentFormModal from '@/components/StudentFormModal.vue';
import StudentDetailModal from '@/components/StudentDetailModal.vue';

const store = useStudentStore();
const isOnline = computed(() => store.isConnected.value);

onMounted(() => {
  store.init();
});

onUnmounted(() => {
  store.destroy();
});
const searchQuery = ref('');
const showFormModal = ref(false);
const showViewModal = ref(false);
const editingStudent = ref<Student | null>(null);
const viewingStudent = ref<Student | null>(null);

const filteredStudents = computed(() => {
  if (!searchQuery.value) return store.students;
  return store.searchStudents(searchQuery.value);
});

const reconnect = async () => {
  store.destroy();
  store.init();
  const toast = await toastController.create({
    message: 'Reconnecting to Firebase...',
    duration: 1500,
    color: 'medium'
  });
  await toast.present();
};

const openAddModal = () => {
  editingStudent.value = null;
  showFormModal.value = true;
};

const openEditModal = (student: Student) => {
  editingStudent.value = student;
  showFormModal.value = true;
};

const openViewModal = (student: Student) => {
  viewingStudent.value = student;
  showViewModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  editingStudent.value = null;
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewingStudent.value = null;
};

const editFromView = (student: Student) => {
  closeViewModal();
  openEditModal(student);
};

const handleSave = async (data: Omit<Student, 'id'>) => {
  if (editingStudent.value) {
    await store.updateStudent(editingStudent.value.id, data);
    const toast = await toastController.create({
      message: 'Student updated successfully!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  } else {
    await store.addStudent(data);
    const toast = await toastController.create({
      message: 'Student added successfully!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }
  closeFormModal();
};

const confirmDelete = async (student: Student) => {
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: `Are you sure you want to delete ${student.name}?`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete',
        role: 'destructive',
        handler: async () => {
          await store.deleteStudent(student.id);
          const toast = await toastController.create({
            message: 'Student deleted successfully!',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      }
    ]
  });
  await alert.present();
};
</script>
