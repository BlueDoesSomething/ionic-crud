<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('close')">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="$emit('close')">Close</ion-button>
        </ion-buttons>
        <ion-title>Student Details</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="student && $emit('edit', student)">
            <ion-icon :icon="createOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="student">
      <div class="profile-header">
        <div class="avatar-large">{{ student.name.charAt(0).toUpperCase() }}</div>
        <h1>{{ student.name }}</h1>
        <p class="student-id">{{ student.studentId }}</p>
      </div>

      <ion-list>
        <ion-item>
          <ion-icon :icon="bookOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <p>Course</p>
            <h2>{{ student.course }}</h2>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon :icon="calendarOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <p>Year Level</p>
            <h2>{{ getYearLabel(student.yearLevel) }}</h2>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon :icon="peopleOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <p>Section</p>
            <h2>{{ student.section }}</h2>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-icon :icon="callOutline" slot="start" color="primary"></ion-icon>
          <ion-label>
            <p>Contact Number</p>
            <h2>{{ student.contactNumber }}</h2>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonList, IonItem, IonLabel
} from '@ionic/vue';
import { createOutline, bookOutline, calendarOutline, peopleOutline, callOutline } from 'ionicons/icons';
import { Student } from '../store/studentStore';

defineProps<{
  isOpen: boolean;
  student: Student | null;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'edit', student: Student): void;
}>();

const getYearLabel = (year: string): string => {
  const labels: Record<string, string> = {
    '1': '1st Year',
    '2': '2nd Year',
    '3': '3rd Year',
    '4': '4th Year',
    '5': '5th Year'
  };
  return labels[year] || year;
};
</script>

<style scoped>
.profile-header {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-primary-shade));
  color: white;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  margin: 0 auto 16px;
}

.profile-header h1 {
  margin: 0 0 4px;
  font-size: 24px;
}

.student-id {
  margin: 0;
  opacity: 0.8;
}
</style>
