<template>
  <form class="form mb-64" @submit.prevent="handleDecode()">
    <FileUpload
      label="Image with Secret Message"
      :has-error="errors.fileValidationError"
      @upload="
        file = $event;
        errors.fileValidationError = false;
      "
    >
      <p v-if="errors.fileValidationError" class="text-sm text-red-500">
        Please select a file
      </p>
    </FileUpload>
    <p
      v-if="errors.permissionError"
      class="text-red-500 w-3/4 mx-auto text-center"
    >
      Whoops! Looks like something went wrong. Perhabs you don't have permission
      to access this message.
    </p>
    <BaseButton
      class="px-6 py-3 btn-primary mt-4"
      html-type="submit"
      :disabled="loading"
    >
      Decode
    </BaseButton>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useDownload } from '../../composition';
import { useStore } from '../../store';
import { imageService } from '../../api/imageService';

export default defineComponent({
  setup() {
    const store = useStore();
    const loading = ref(false);

    const file = ref<File>();
    const errors = reactive({
      fileValidationError: false,
      permissionError: false
    });

    const handleDecode = async () => {
      errors.fileValidationError = false;
      errors.permissionError = false;
      loading.value = true;
      try {
        if (file.value) {
          const { isValid, data } = await imageService().decodeMessage(
            file.value,
            store
          ).promise;

          if (isValid.value && data.value) {
            useDownload().saveTextFile(
              data.value.message,
              'secret.txt',
              'text/plain'
            );
          } else {
            errors.permissionError = true;
          }
        } else {
          errors.fileValidationError = true;
        }
      } catch {
        //
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      file,
      errors,
      handleDecode
    };
  }
});
</script>

<style scoped>
.form {
  width: 100%;
  display: grid;
  row-gap: 30px;
}
</style>
