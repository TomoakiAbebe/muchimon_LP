/**
 * ムチモンLP - メインJavaScript
 * セクション読み込み、CTA設定、アコーディオン、スムーススクロール
 */

// CTA URL (後で差し替える)
const CTA_URL = "#";

// セクションの読み込み順序
const SECTIONS = [
    'header',
    'hero',
    'problem',
    'features',
    'difference',
    'benefits',
    'pricing',
    'final-cta',
    'footer'
];

/**
 * セクションを読み込んでDOMに挿入
 */
async function loadSections() {
    const app = document.getElementById('app');
    const loading = document.getElementById('loading');
    
    if (!app) {
        console.error('Error: #app element not found');
        return;
    }
    
    try {
        // 各セクションを順番に読み込み
        for (const section of SECTIONS) {
            const response = await fetch(`./sections/${section}.html`);
            
            if (!response.ok) {
                throw new Error(`Failed to load section: ${section}.html (Status: ${response.status})`);
            }
            
            const html = await response.text();
            app.insertAdjacentHTML('beforeend', html);
        }
        
        // 読み込み完了後に初期化
        initializePage();
        
        // ローディングを非表示
        if (loading) {
            loading.style.display = 'none';
        }
        
        // フェードイン効果
        app.classList.add('fade-in');
        
    } catch (error) {
        console.error('Error loading sections:', error);
        
        // エラーメッセージを表示
        app.innerHTML = `
            <div class="min-h-screen flex items-center justify-center p-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
                    <h2 class="text-xl font-bold text-red-800 mb-2">読み込みエラー</h2>
                    <p class="text-red-700 mb-4">ページの読み込みに失敗しました。</p>
                    <p class="text-sm text-red-600 mb-4">${error.message}</p>
                    <button onclick="location.reload()" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
                        再読み込み
                    </button>
                </div>
            </div>
        `;
        
        // ローディングを非表示
        if (loading) {
            loading.style.display = 'none';
        }
    }
}

/**
 * ページ初期化（読み込み完了後に実行）
 */
function initializePage() {
    applyCTAUrls();
    initializeAccordion();
    initializeSmoothScroll();
}

/**
 * 全てのCTAボタンにURLを適用
 */
function applyCTAUrls() {
    const ctaLinks = document.querySelectorAll('.js-cta-link');
    ctaLinks.forEach(link => {
        link.href = CTA_URL;
    });
    console.log(`Applied CTA_URL to ${ctaLinks.length} links`);
}

/**
 * アコーディオンの初期化（競合との違いセクション用）
 */
function initializeAccordion() {
    const accordionButtons = document.querySelectorAll('[data-accordion-toggle]');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-accordion-toggle');
            const target = document.getElementById(targetId);
            const icon = button.querySelector('[data-accordion-icon]');
            
            if (!target) return;
            
            // トグル
            const isHidden = target.classList.contains('hidden');
            
            if (isHidden) {
                target.classList.remove('hidden');
                button.setAttribute('aria-expanded', 'true');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            } else {
                target.classList.add('hidden');
                button.setAttribute('aria-expanded', 'false');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
    
    console.log(`Initialized ${accordionButtons.length} accordion items`);
}

/**
 * スムーススクロールの初期化（ヘッダーのアンカーリンク用）
 */
function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // CTA リンクや空のハッシュはスキップ
            if (href === '#' || link.classList.contains('js-cta-link')) {
                return;
            }
            
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                e.preventDefault();
                
                // ヘッダーの高さを考慮してスクロール
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // フォーカスを移動（アクセシビリティ）
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
    
    console.log(`Initialized smooth scroll for ${anchorLinks.length} anchor links`);
}

/**
 * DOMContentLoaded時にセクション読み込みを開始
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSections);
} else {
    loadSections();
}
