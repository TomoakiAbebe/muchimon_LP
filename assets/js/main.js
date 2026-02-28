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
        // 各セクションを順番に読み込み（キャッシュバスティング付き）
        const timestamp = new Date().getTime();
        for (const section of SECTIONS) {
            const response = await fetch(`./sections/${section}.html?v=${timestamp}`);
            
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
    initializeMobileMenu();
}

/**
 * モバイルメニューの初期化
 */
function initializeMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const body = document.body;
    
    function openMenu() {
        console.log('Opening mobile menu');
        menu.classList.add('menu-open');
        overlay.classList.remove('hidden');
        button.classList.add('hamburger-open');
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-label', 'メニューを閉じる');
        body.classList.add('menu-open-body');
    }
    
    function closeMenu() {
        console.log('Closing mobile menu');
        menu.classList.remove('menu-open');
        overlay.classList.add('hidden');
        button.classList.remove('hamburger-open');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'メニューを開く');
        body.classList.remove('menu-open-body');
    }
    
    if (button && menu && overlay) {
        // ハンバーガーボタンクリック
        button.addEventListener('click', () => {
            console.log('Hamburger button clicked');
            const isOpen = menu.classList.contains('menu-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // 閉じるボタンクリック
        if (closeButton) {
            closeButton.addEventListener('click', closeMenu);
        }
        
        // オーバーレイクリック
        overlay.addEventListener('click', closeMenu);
        
        // メニュー内のリンククリック
        const menuLinks = menu.querySelectorAll('.mobile-menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('menu-open')) {
                closeMenu();
            }
        });
        
        console.log('Mobile menu initialized successfully');
    } else {
        console.error('Mobile menu elements not found:', { button, menu, overlay });
    }
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
                
                // ヘッダーの高さを考慮してスクロール（セクションの上端をヘッダー直下に配置）
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
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
