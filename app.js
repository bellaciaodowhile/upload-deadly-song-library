import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://mkjddexvbwxttkwiuahy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ramRkZXh2Ynd4dHRrd2l1YWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzA4MDQsImV4cCI6MjA2MDEwNjgwNH0.4d5j2AKDfWBF4kK0aZ8JRK2yXJ9yfzyy6ibLk_zp680';
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById("importButton").addEventListener("click", function() {
    document.getElementById("fileUpload").click();
});

const preview = document.querySelector('.preview');
var selectedFile;
document
  .getElementById("fileUpload")
  .addEventListener("change", function(event) {
    selectedFile = event.target.files[0];
    const fileType = selectedFile.type;
    preview.style.display = 'block';
    preview.textContent = `Archivo cargado: ${selectedFile.name}`;
    if (fileType !== "application/vnd.ms-excel" && fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        alert("Solo se permiten archivos excel (.xls o .xlsx)");
        event.target.value = "";
        return
    }
  });
document
  .getElementById("uploadExcel")
  .addEventListener("click", function() {
    if (selectedFile) {
      var fileReader = new FileReader();
      fileReader.onload = function(event) {
        var data = event.target.result;

        var workbook = XLSX.read(data, {
          type: "binary"
        });
        workbook.SheetNames.forEach(async (sheet) => {
          let rowObject = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          );
          let jsonObject = JSON.stringify(rowObject, null, 2);
          console.log(jsonObject)
          const { data, error } = await supabase
            .from('data')
            .select()
            if (data.length > 0) {
                const { error } = await supabase
                .from('data')
                .update({ catalogue: jsonObject })
                .eq('id', 1)
                if (error) return alert('Ha ocurrido un error al cargar la data.')
                alert('Datos cargados correctamente.')
                location.href = 'https://libreriacantomortal.vercel.app/';
                preview.style.display = 'block';
                return;
            }
            try {
                const { error } = await supabase
                .from('data')
                .insert({ catalogue: jsonObject })
                if (error) return alert('Ha ocurrido un error al cargar la data.')
                alert('Datos cargados correctamente.')
                preview.style.display = 'block';
                location.href = 'https://libreriacantomortal.vercel.app/';
            } catch (error) {}
        });
      };
      fileReader.readAsBinaryString(selectedFile);
    } else {
        alert('Se requiere importar el archivo excel para continuar.')
    }
});