import requests
import random  # <--- YENİ: Rastgele sayı üretmek için
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from store.models import Product, Category

class Command(BaseCommand):
    help = 'RAWG.io üzerinden oyunları çeker ve RASTGELE FİYATLAR atar'

    def handle(self, *args, **kwargs):
        # 👇 BURAYA API KEY'İNİ YAPIŞTIR
        API_KEY = "ee1d8f1ad87c47fab14dbbf30c15ec0f" 
        
        self.stdout.write("🎮 Fiyatlar güncelleniyor... Dükkan yenileniyor...")

        genres = {
            'action': 'Action',
            'role-playing-games-rpg': 'RPG',
            'strategy': 'Strategy',
            'shooter': 'FPS/Shooter',
            'indie': 'Indie'
        }

        for genre_slug, genre_name in genres.items():
            self.stdout.write(f"🕹️  Kategori: {genre_name}...")

            category, created = Category.objects.get_or_create(
                slug=genre_slug,
                defaults={'name': genre_name}
            )

            # page_size=25 yaptık ki 100 ürünü bulalım
            url = f"https://api.rawg.io/api/games?key={API_KEY}&genres={genre_slug}&page_size=25&ordering=-metacritic"
            
            try:
                response = requests.get(url)
                if response.status_code != 200:
                    continue
                data = response.json()
                games = data.get('results', [])
            except Exception:
                continue

            count = 0
            for game in games:
                name = game['name']
                slug = slugify(name)
                bg_image = game.get('background_image', '')
                rating = game.get('metacritic', 0)
                released = game.get('released', 'Bilinmiyor')
                desc = f"Yayınlanma: {released} | Metacritic: {rating}/100"

                if Product.objects.filter(slug=slug).exists():
                    continue

                # --- 💰 YENİ FİYAT MANTIĞI ---
                # 1. Puanı yüksekse daha pahalı olsun
                base_price = 300
                if rating and rating > 90:
                    base_price = 1200 # AAA Kalite oyunlar
                elif rating and rating > 80:
                    base_price = 800
                else:
                    base_price = 400

                # 2. Üzerine biraz rastgelelik katalım (Farklı görünsünler)
                random_add = random.randint(0, 500)
                final_price = base_price + random_add
                
                # 3. Sonu .99 ile bitsin (Psikolojik fiyatlandırma)
                final_price = final_price - 0.01 

                Product.objects.create(
                    category=category,
                    name=name,
                    slug=slug,
                    description=desc,
                    price=final_price, # <--- Hesaplanan fiyatı basıyoruz
                    stock=random.randint(10, 100), # Stoklar da rastgele olsun
                    is_active=True,
                    image_url=bg_image
                )
                count += 1
            
            self.stdout.write(f"   └── {count} oyun etiketlendi.")

        self.stdout.write(self.style.SUCCESS("💸 Dükkan Hazır! Fiyatlar birbirinden farklı."))