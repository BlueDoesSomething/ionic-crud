<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('close')">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="$emit('close')">Cancel</ion-button>
        </ion-buttons>
        <ion-title>{{ editingStudent ? 'Edit Student' : 'Add Student' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="save">Save</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input
            v-model="form.studentId"
            label="Student ID"
            label-placement="floating"
            placeholder="e.g., 2024-00001"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            v-model="form.name"
            label="Full Name"
            label-placement="floating"
            placeholder="e.g., Juan Dela Cruz"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-select v-model="form.course" label="Course" label-placement="floating">
            <ion-select-option value="">Select Course</ion-select-option>
            <ion-select-option value="BS Computer Science">BS Computer Science</ion-select-option>
            <ion-select-option value="BS Information Technology">BS Information Technology</ion-select-option>
            <ion-select-option value="BS Engineering">BS Engineering</ion-select-option>
            <ion-select-option value="BS Business Administration">BS Business Administration</ion-select-option>
            <ion-select-option value="BS Accountancy">BS Accountancy</ion-select-option>
            <ion-select-option value="BS Nursing">BS Nursing</ion-select-option>
            <ion-select-option value="BS Education">BS Education</ion-select-option>
            <ion-select-option value="BA Arts">BA Arts</ion-select-option>
            <ion-select-option value="BS Psychology">BS Psychology</ion-select-option>
            <ion-select-option value="Other">Other</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item v-if="form.course === 'Other'">
          <ion-input
            v-model="form.customCourse"
            label="Custom Course"
            label-placement="floating"
            placeholder="Enter your course"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-select v-model="form.yearLevel" label="Year Level" label-placement="floating">
            <ion-select-option value="">Select Year</ion-select-option>
            <ion-select-option value="1">1st Year</ion-select-option>
            <ion-select-option value="2">2nd Year</ion-select-option>
            <ion-select-option value="3">3rd Year</ion-select-option>
            <ion-select-option value="4">4th Year</ion-select-option>
            <ion-select-option value="5">5th Year</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-input
            v-model="form.section"
            label="Section"
            label-placement="floating"
            placeholder="e.g., A, B, C"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            v-model="form.contactNumber"
            label="Contact Number"
            label-placement="floating"
            type="tel"
            placeholder="e.g., 09171234567"
          ></ion-input>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonList, IonItem, IonInput, IonSelect, IonSelectOption, alertController
} from '@ionic/vue';
import { Student } from '../store/studentStore';

const props = defineProps<{
  isOpen: boolean;
  editingStudent: Student | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: Omit<Student, 'id'>): void;
}>();

const form = ref({
  studentId: '',
  name: '',
  course: '',
  customCourse: '',
  yearLevel: '',
  section: '',
  contactNumber: ''
});

const resetForm = () => {
  form.value = {
    studentId: '',
    name: '',
    course: '',
    customCourse: '',
    yearLevel: '',
    section: '',
    contactNumber: ''
  };
};

watch(() => props.isOpen, (open) => {
  if (open && props.editingStudent) {
    const knownCourses = [
      'BS Computer Science', 'BS Information Technology', 'BS Engineering',
      'BS Business Administration', 'BS Accountancy', 'BS Nursing',
      'BS Education', 'BA Arts', 'BS Psychology'
    ];
    if (knownCourses.includes(props.editingStudent.course)) {
      form.value.course = props.editingStudent.course;
      form.value.customCourse = '';
    } else {
      form.value.course = 'Other';
      form.value.customCourse = props.editingStudent.course;
    }
    form.value.studentId = props.editingStudent.studentId;
    form.value.name = props.editingStudent.name;
    form.value.yearLevel = props.editingStudent.yearLevel;
    form.value.section = props.editingStudent.section;
    form.value.contactNumber = props.editingStudent.contactNumber;
  } else if (open) {
    resetForm();
  }
});

const save = async () => {
  if (!form.value.studentId || !form.value.name || !form.value.yearLevel || !form.value.section || !form.value.contactNumber) {
    const alert = await alertController.create({
      header: 'Missing Fields',
      message: 'Please fill in all required fields.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  if (!form.value.course) {
    const alert = await alertController.create({
      header: 'Missing Course',
      message: 'Please select a course.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  const course = form.value.course === 'Other' ? form.value.customCourse : form.value.course;

  if (form.value.course === 'Other' && !course) {
    const alert = await alertController.create({
      header: 'Missing Course',
      message: 'Please enter your course.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }

  emit('save', {
    studentId: form.value.studentId,
    name: form.value.name,
    course: course,
    yearLevel: form.value.yearLevel,
    section: form.value.section,
    contactNumber: form.value.contactNumber
  });

  resetForm();
};
</script>
