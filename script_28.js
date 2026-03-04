
  window.BokchaeAdComponent = {
      adCount: 0,
      
      getMent: function(cat) {
          if (cat === 'Tarot') return "타로 카드가 전하는 메시지가 도움이 되셨나요? 정성 어린 복채(광고 클릭)는 다음에 보실 타로의 적중률을 높여주는 기운이 됩니다.";
          if (cat === 'Saju') return "사주 명리학으로 풀어낸 오늘의 운을 잘 활용하시길 바랍니다. 복채를 나누는 마음으로 광고를 확인하시면, 막혔던 운의 흐름이 더욱 원활해질 것입니다.";
          if (cat === 'Zodiac') return "오늘의 별자리가 당신을 향해 빛나고 있네요. 작은 나눔(광고 클릭)이 더 큰 행운이 되어 당신에게 돌아갈 거예요.";
          return "당신의 운세에 작은 행운을 더해보세요. 복채를 나누는 마음이 더 큰 행운이 되어 돌아갑니다.";
      },

      createHtml: function(category) {
          this.adCount++;
          const ment = this.getMent(category);
          return `
          <div class="bokchae-ad-container" style="margin: 30px 0; padding: 20px 15px; border: 2px dashed #d4af37; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <p style="font-weight: 700; color: #b8860b; margin-bottom: 12px; font-size: 0.95rem; line-height: 1.5; word-break: keep-all;">
                  ✨ ${ment} ✨
              </p>
              <div style="min-height: 100px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.02); border-radius: 8px;">
                  <ins class="adsbygoogle"
                       style="display:block; width:100%;"
                       data-ad-client="ca-pub-6568940861111005"
                       data-ad-slot="YOUR_AD_SLOT"
                       data-ad-format="auto"
                       data-full-width-responsive="true"></ins>
              </div>
          </div>
          `;
      },

      injectScript: function() {
          try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
      }
  };
  