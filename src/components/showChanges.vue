<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
        title="Changes to Test"
      >
      <v-card-text v-html="changes"></v-card-text>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ShowChanges",
  data () {
    return {
      dialog: true,
      changes: '<ol><li>Add/update/delete a Rets (Add rets does not open details page yet)</li><br><li>Related Rets workflow</li><br><li>Flags, importance</li><br><br><li>History</li><br><li>Styling, etc...</li></ol>'
    }
  },
}
</script>

<style scoped>

</style>