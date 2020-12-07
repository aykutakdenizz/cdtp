1-Oncelikle Node js indirilmeli ve kurulmalı.
2-Teminalde proje dizininde "npm install" komutu yazılmalı.
3-Server ip ve port numarasını terminale yazdırmaktadır.
4-Port işlemleri için öncelikle istenilen porta cihaz takılmalıdır. Aksi halde port okunamaz.
5- /start isteğinde bulunarak okumayı başlatabilir /stop ile bitirebilirsiniz.
6- Sıcaklık okuma için GET /getTemparature?seraId=1 isteğinde bulunulmalı.
7- Sıcaklık göndermek için POST /setTemparature body:{seraId=, temperature=} isteğinde bulunulmalı



serialPort kütüphanesi ile ilgili hata oluşursa şu adresi kontrol edebilirsiniz;
https://stackoverflow.com/questions/57879150/how-can-i-solve-error-gypgyp-errerr-find-vsfind-vs-msvs-version-not-set-from-c
buradaki visual studio programını düzenle(modify) diyip Desktop development with C++ eklentisi eklenmeli