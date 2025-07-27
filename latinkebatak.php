<?php
/**
 * Plugin Name: Latin To Batak
 * Plugin URI: https://hurufbatak.id/
 * Description: A plugin to transliterate Latin text into Batak script according to the selected dialect.
 * Version: 1.0
 * Author: Ritonga Mulia
 * Author URI: https://dipasid.com/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: batak-transliteration
 */


function latin_batak_shortcode() {
    ob_start(); ?>
    <div id="transliterasi-container" class="translit-container">
 

  <!-- Input Teks -->
  <label for="inp_txt">Teks Latin:</label><br>
  <textarea id="inp_txt" rows="4" style="width:100%;" placeholder="Ketik teks Latin di sini..."></textarea><br><br>

  <!-- Pilihan Dialek -->
  <fieldset>
    <legend>Pilih Dialek:</legend>
    <div class="dialek-group">
  <label><input type="radio" name="bahasa" value="toba" checked> 🐃 Toba</label>
  <label><input type="radio" name="bahasa" value="angkola-mandailing"> 🌄 Mandailing</label>
  <label><input type="radio" name="bahasa" value="karo"> 🔥 Karo</label>
  <label><input type="radio" name="bahasa" value="simalungun"> 🌿 Simalungun</label>
  <label><input type="radio" name="bahasa" value="pakpak-dairi"> ⛰️ Pakpak</label>
</div>
  </fieldset><br>

  <!-- Tombol Aksi -->
  <button id="tb_convert">Ubah Latin Ke Batak</button>
  <button id="tb_copy">Salin Hasil</button><br><br>

  <!-- Output -->
  <label for="ta">Hasil Ubah Latin Ke Aksara Batak:</label><br>
  <textarea id="ta" class="batak-output " rows="4" style="width:100%;" readonly></textarea>
</div>

    <script src="<?php echo plugin_dir_url(__FILE__); ?>/assets/css/style.css"></script>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>/assets/js/latin_ke_batak.js"></script>
    <?php
    return ob_get_clean();
}
add_shortcode('latin_batak', 'latin_batak_shortcode');
?>

