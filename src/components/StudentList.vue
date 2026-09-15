<template>
  <ion-list v-if="students.length > 0">
    <ion-item-sliding v-for="student in students" :key="student.id">
      <ion-item button @click="$emit('view', student)">
        <ion-avatar slot="start">
          <div class="avatar">{{ student.name.charAt(0).toUpperCase() }}</div>
        </ion-avatar>
        <ion-label>
          <h2>{{ student.name }}</h2>
          <p>{{ student.studentId }} | {{ student.course }}</p>
          <p>Year {{ student.yearLevel }} - {{ student.section }}</p>
        </ion-label>
        <ion-icon :icon="chevronForwardOutline" slot="end"></ion-icon>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="warning" @click="$emit('edit', student)">
          <ion-icon :icon="createOutline" slot="icon-only"></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger" @click="$emit('delete', student)">
          <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>

  <div v-else class="empty-state">
    <ion-icon :icon="schoolOutline" class="empty-icon"></ion-icon>
    <h2>No Students Found</h2>
    <p v-if="searchQuery">No students match your search.</p>
    <p v-else>Add your first student to get started.</p>
    <ion-button v-if="!searchQuery" @click="$emit('add')">
      <ion-icon :icon="addOutline" slot="start"></ion-icon>
      Add Student
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import {
  IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonAvatar, IonIcon, IonButton
} from '@ionic/vue';
import { chevronForwardOutline, createOutline, trashOutline, schoolOutline, addOutline } from 'ionicons/icons';
import { Student } from '../store/studentStore';

defineProps<{
  students: Student[];
  searchQuery: string;
}>();

defineEmits<{
  (e: 'view', student: Student): void;
  (e: 'edit', student: Student): void;
  (e: 'delete', student: Student): void;
  (e: 'add'): void;
}>();
</script>

<style scoped>
.avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-primary);
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50%;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.empty-icon {
  font-size: 80px;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}

.empty-state h2 {
  margin: 0 0 8px;
  color: var(--ion-color-dark);
}

.empty-state p {
  margin: 0 0 16px;
  color: var(--ion-color-medium);
}
</style>
