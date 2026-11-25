(function (root) {
  'use strict';

  const BLACK = 1;
  const WHITE = 2;

  const ROADMAP_STAGES = [
    {
      id: 'stage-1',
      number: 1,
      title: 'Cấp 1: Nhập Môn & Luật Chơi',
      rankRange: 'Chưa biết gì → 20 Kyu',
      boardSize: '9×9',
      duration: 'Tuần 1 – 2',
      goal: 'Nắm vững khái niệm Khí, Bắt quân (Atari), Luật Tự Sát, Luật Cướp (Ko) và hoàn thành trọn vẹn một ván cờ 9×9.',
      weeklyPlan: 'Mỗi ngày 15 phút làm bài tập Khí & Atari + 2 ván 9×9.',
      masteryCheck: 'Không còn bị bắt quân ngớ ngẩn do quên đếm khí; biết tự đếm đất kết thúc ván.'
    },
    {
      id: 'stage-2',
      number: 2,
      title: 'Cấp 2: Chiến Thuật Bắt Quân',
      rankRange: '20 Kyu → 15 Kyu',
      boardSize: '9×9 → 13×13',
      duration: 'Tuần 3 – 5',
      goal: 'Thành thạo 6 đòn chiến thuật cốt lõi: Nối/Cắt, Song Chiếu, Cầu Thang (Shicho), Lưới (Geta), Hồi Mã Thương (Snapback) và Đua Khí (Semeai).',
      weeklyPlan: 'Giải 10 bài tập bắt quân/ngày + chuyển lên bàn 13×13.',
      masteryCheck: 'Nhìn ra ngay thế Cầu Thang hoặc thế Lưới trước khi đánh; thắng các cuộc đua khí cơ bản.'
    },
    {
      id: 'stage-3',
      number: 3,
      title: 'Cấp 3: Sống & Chết (Tsumego)',
      rankRange: '15 Kyu → 8 Kyu',
      boardSize: '13×13 → 19×19',
      duration: 'Tháng 2 – 3',
      goal: 'Hiểu bản chất Hai Mắt Sống, phân biệt Mắt Thật – Mắt Giả, nắm điểm sống chết (Vital Point), kỹ thuật phá mắt Nakade và thế Song Sống (Seki).',
      weeklyPlan: '70% thời gian làm Tsumego cơ bản + 1 ván 19×19 mỗi ngày.',
      masteryCheck: 'Không chết oan các đám quân ở góc/biên; biết phá mắt đối phương bằng Nakade.'
    },
    {
      id: 'stage-4',
      number: 4,
      title: 'Cấp 4: Hình Cờ & Thủ Cân (Tesuji)',
      rankRange: '8 Kyu → 5 Kyu',
      boardSize: '19×19',
      duration: 'Tháng 4 – 6',
      goal: 'Phân biệt Hình cờ Đẹp (Nối Tre, Miệng Hổ) và Hình cờ Xấu (Tam Giác Rỗng); áp dụng Thủ Cân để cắt, nối và phá mắt hiệu quả.',
      weeklyPlan: 'Học 5–10 bài Hình Cờ & Tesuji/ngày + tự kiểm điểm (review) sau mỗi ván.',
      masteryCheck: 'Tránh được Tam Giác Rỗng; biết dùng Bẻ đầu hai quân và Điểm 1-1.'
    },
    {
      id: 'stage-5',
      number: 5,
      title: 'Cấp 5: Khai Cuộc & Định Thức',
      rankRange: '5 Kyu → 2 Kyu',
      boardSize: '19×19',
      duration: 'Tháng 6 – 9',
      goal: 'Làm chủ nguyên tắc Khai cuộc toàn bàn (Góc → Biên → Trung tâm, Đường 3 vs Đường 4) và hiểu bản chất cân bằng của các Định thức (Joseki) phổ biến.',
      weeklyPlan: 'Thực hành 3–4 định thức góc 4-4/3-4 + phân tích khai cuộc trên bàn 19×19.',
      masteryCheck: 'Không học vẹt định thức; biết chọn biến Joseki phù hợp với thế trận toàn bàn.'
    },
    {
      id: 'stage-6',
      number: 6,
      title: 'Cấp 6: Trung Cuộc & Thu Quan Cao Cấp',
      rankRange: '2 Kyu → 1 Dan+',
      boardSize: '19×19',
      duration: 'Tháng 9 – 12+',
      goal: 'Đọc sâu chiến lược Đả Nhập (Invasion) vs Xâm Lấn (Reduction), tính giá trị Tiên Thủ (Sente) – Hậu Thủ (Gote) và đòn Thu Quan như Hầu Khiêu.',
      weeklyPlan: 'Luyện Tsumego cấp Dan + chơi cờ chậm 19×19 + phân tích ván đấu với AI (KataGo).',
      masteryCheck: 'Đọc trước 5–7 nước ở trung cuộc và tối ưu từng điểm thu quan cuối ván.'
    }
  ];

  const LESSONS = [
    // ==================== STAGE 1 ====================
    {
      id: 'lesson-1-1',
      stageId: 'stage-1',
      code: '1.1',
      title: 'Bàn cờ & Khái niệm Khí',
      jpTerm: 'Kokyu / Dame (Khí)',
      difficulty: 'Nhập môn',
      boardSize: 9,
      summary: 'Mỗi quân cờ tồn tại nhờ các giao điểm trống liền kề theo chiều ngang/dọc gọi là Khí.',
      theoryHtml: `
        <p>Quân cờ trong cờ vây được đặt trên <strong>giao điểm</strong> của các đường kẻ (không phải trong ô vuông). Một quân cờ đứng riêng lẻ có số <strong>Khí (Liberties)</strong> phụ thuộc vào vị trí:</p>
        <ul>
          <li><strong>Ở trung tâm:</strong> tối đa <strong>4 khí</strong> (trên, dưới, trái, phải).</li>
          <li><strong>Ở cạnh (biên):</strong> tối đa <strong>3 khí</strong>.</li>
          <li><strong>Ở góc:</strong> chỉ có tối đa <strong>2 khí</strong>.</li>
        </ul>
        <p><strong>Lưu ý quan trọng:</strong> Đường chéo <em>không</em> tạo thành khí và <em>không</em> nối quân với nhau. Khi một nhóm quân hết sạch khí (0 khí), toàn bộ nhóm đó bị nhấc khỏi bàn cờ.</p>
        <div class="proverb-box">💡 <strong>Khẩu quyết:</strong> “Góc hai, biên ba, giữa bàn bốn khí.”</div>
      `,
      demoInitialPosition: {
        black: [[4, 4], [4, 0], [0, 0]],
        white: []
      },
      demoSteps: [
        {
          caption: 'Quan sát 3 quân Đen: ở giữa bàn (E5) có 4 khí, ở biên (E9) có 3 khí, ở góc (A9) chỉ có 2 khí.',
          markers: [
            { x: 4, y: 3, type: 'dot', color: '#0284c7' },
            { x: 4, y: 5, type: 'dot', color: '#0284c7' },
            { x: 3, y: 4, type: 'dot', color: '#0284c7' },
            { x: 5, y: 4, type: 'dot', color: '#0284c7' },
            { x: 3, y: 0, type: 'dot', color: '#0284c7' },
            { x: 5, y: 0, type: 'dot', color: '#0284c7' },
            { x: 4, y: 1, type: 'dot', color: '#0284c7' },
            { x: 1, y: 0, type: 'dot', color: '#0284c7' },
            { x: 0, y: 1, type: 'dot', color: '#0284c7' }
          ]
        },
        {
          moves: [{ x: 1, y: 0, color: WHITE }],
          caption: 'Khi Trắng đi vào B9, quân Đen ở góc (A9) bị bịt mất 1 khí và chỉ còn duy nhất 1 khí tại A8!'
        },
        {
          moves: [{ x: 0, y: 1, color: WHITE }],
          caption: 'Trắng bịt nốt khí cuối cùng tại A8 → Quân Đen (A9) còn 0 khí và bị bắt ra khỏi bàn cờ!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Quân Trắng ở góc (A9) chỉ còn 1 khí. Hãy đặt quân Đen vào khí cuối cùng để bắt quân Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[1, 0]],
          white: [[0, 0]]
        },
        hint: {
          text: 'Hãy nhìn vào giao điểm trống nằm ngay bên dưới quân Trắng (A8).',
          marker: { x: 0, y: 1, type: 'circle' }
        },
        tree: {
          '0,1': {
            status: 'solved',
            feedback: 'Chính xác! Bạn đã bịt nốt khí cuối cùng của quân Trắng ở góc và ăn được quân đầu tiên.'
          },
          '1,1': {
            status: 'wrong',
            reply: [0, 1],
            feedback: 'Nước chéo (B8) không chạm vào khí của quân Trắng! Trắng chạy ra A8 và có thêm khí.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm giao điểm trống nằm ngay cạnh (ngang/dọc) quân Trắng để lấy nốt khí cuối cùng.'
      }
    },
    {
      id: 'lesson-1-2',
      stageId: 'stage-1',
      code: '1.2',
      title: 'Bắt Quân (Atari) & Ăn Quân',
      jpTerm: 'Atari (Chiếu bắt)',
      difficulty: 'Nhập môn',
      boardSize: 9,
      summary: 'Khi một quân hoặc cả đám quân chỉ còn đúng 1 khí, trạng thái đó gọi là Atari (bị chiếu bắt).',
      theoryHtml: `
        <p><strong>Atari</strong> trong cờ vây tương tự như “Chiếu” trong cờ vua: một quân hoặc một cụm quân liền kề chỉ còn duy nhất <strong>1 khí</strong>.</p>
        <ul>
          <li>Các quân cùng màu đứng liền kề theo chiều ngang/dọc sẽ <strong>nối thành một nhóm</strong> và dùng chung khí.</li>
          <li>Nếu bạn bịt nốt khí cuối cùng của nhóm bị Atari, toàn bộ nhóm đó sẽ bị ăn (gọi là <strong>Tù binh</strong>, cộng điểm cuối ván).</li>
        </ul>
        <div class="proverb-box">💡 <strong>Mẹo thực chiến:</strong> Luôn kiểm tra xem quân đối phương (và quân mình!) có nhóm nào chỉ còn 1 hoặc 2 khí không.</div>
      `,
      demoInitialPosition: {
        black: [[3, 4], [5, 4]],
        white: [[4, 4]]
      },
      demoSteps: [
        {
          caption: 'Quân Trắng ở trung tâm (E5) đang bị 2 quân Đen ép hai bên, chỉ còn lại 2 khí (E6 và E4).'
        },
        {
          moves: [{ x: 4, y: 3, color: BLACK }],
          caption: 'Đen đánh E6: Trắng chỉ còn đúng 1 khí tại E4 → Đen đang bắt (Atari) Trắng!'
        },
        {
          moves: [{ x: 4, y: 5, color: BLACK }],
          caption: 'Nếu Trắng không chạy kịp, Đen đánh nốt vào E4 để ăn quân Trắng.'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Quân Trắng ở E5 đang trong trạng thái Atari. Hãy đi nước quyết định để ăn quân Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 4], [5, 4], [4, 3]],
          white: [[4, 4]]
        },
        hint: {
          text: 'Hãy kiểm tra giao điểm trống duy nhất ngay phía dưới quân Trắng (E4).',
          marker: { x: 4, y: 5, type: 'circle' }
        },
        tree: {
          '4,5': {
            status: 'solved',
            feedback: 'Tuyệt vời! Quân Trắng hết khí tại E4 và đã bị bắt gọn.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Nếu bạn đánh chỗ khác, Trắng sẽ chạy ra E4 và thoát thân.'
      }
    },
    {
      id: 'lesson-1-3',
      stageId: 'stage-1',
      code: '1.3',
      title: 'Chạy Trốn Khi Bị Atari',
      jpTerm: 'Nobi (Nối dài tăng khí)',
      difficulty: 'Nhập môn',
      boardSize: 9,
      summary: 'Khi quân mình chỉ còn 1 khí, nước nối dài (Nobi) giúp tăng thêm khí ngay lập tức để thoát hiểm.',
      theoryHtml: `
        <p>Khi một quân của bạn bị đối phương <strong>Atari</strong> (chỉ còn 1 khí), bạn có hai lựa chọn chính:</p>
        <ul>
          <li><strong>Chạy (Nobi):</strong> Đặt thêm một quân cùng màu vào đúng giao điểm khí cuối cùng đó. Nhờ vậy nhóm 2 quân sẽ có thêm 2–3 khí mới.</li>
          <li><strong>Bỏ (Hy sinh):</strong> Nếu chạy không thoát (ví dụ chạy vào góc hoặc gặp tường địch), đừng cố cứu — hãy bỏ nó để đi nơi khác giá trị hơn!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khẩu quyết:</strong> “Bị Atari phải xem: chạy có thêm khí không? Nếu không thêm khí thì đừng chạy!”</div>
      `,
      demoInitialPosition: {
        black: [[4, 4]],
        white: [[3, 4], [5, 4], [4, 3]]
      },
      demoSteps: [
        {
          caption: 'Quân Đen tại E5 đang bị 3 quân Trắng vây chặt, chỉ còn đúng 1 khí ở E4.'
        },
        {
          moves: [{ x: 4, y: 5, color: BLACK }],
          caption: 'Đen nối dài xuống E4 (Nobi)! Giờ 2 quân Đen liên kết với nhau và có tới 3 khí mới (D4, F4, E3), thoát khỏi nguy hiểm.'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Quân Đen E5 đang bị Trắng đe dọa ăn mất ở nước sau. Hãy cứu quân Đen!',
        playerColor: BLACK,
        initialPosition: {
          black: [[4, 4]],
          white: [[3, 4], [5, 4], [4, 3]]
        },
        hint: {
          text: 'Hãy đặt quân vào đúng khí cuối cùng của quân Đen (E4) để mở rộng khí.',
          marker: { x: 4, y: 5, type: 'circle' }
        },
        tree: {
          '4,5': {
            status: 'solved',
            feedback: 'Chính xác! Đen nối dài xuống E4 và tăng từ 1 khí lên thành 3 khí, an toàn thoát hiểm.'
          },
          '3,5': {
            status: 'wrong',
            reply: [4, 5],
            feedback: 'Đánh chéo D4 không nối được với E5! Trắng lập tức đánh E4 và ăn mất quân Đen.'
          },
          '5,5': {
            status: 'wrong',
            reply: [4, 5],
            feedback: 'Đánh chéo F4 không tăng khí cho E5! Trắng đánh E4 và bắt mất quân Đen.'
          }
        },
        defaultWrongFeedback: 'Sai rồi! Nếu bạn đánh chỗ khác, Trắng sẽ đi E4 và ăn ngay quân Đen.'
      }
    },
    {
      id: 'lesson-1-4',
      stageId: 'stage-1',
      code: '1.4',
      title: 'Luật Tự Sát & Luật Cướp (Ko)',
      jpTerm: 'Jisatsu & Ko (Tự sát & Cướp)',
      difficulty: 'Nhập môn',
      boardSize: 9,
      summary: 'Không được tự đặt quân vào nơi 0 khí trừ phi ăn được quân địch; không được ăn cướp trả ngay lập tức.',
      theoryHtml: `
        <p>Đây là hai quy tắc đặc biệt giúp cờ vây không bao giờ rơi vào vòng lặp vô tận:</p>
        <ul>
          <li><strong>Luật Tự Sát (Suicide):</strong> Bạn bị cấm đặt quân vào giao điểm khiến nhóm mình có 0 khí — <em>trừ trường hợp</em> nước đi đó đồng thời làm nhóm địch hết khí và bị bắt trước!</li>
          <li><strong>Luật Cướp (Ko):</strong> Khi hai bên có thể ăn qua ăn lại đúng 1 quân ở cùng một vị trí khiến thế cờ lặp lại y hệt, người vừa bị ăn <strong>không được phép ăn trả ngay lập tức</strong>. Họ phải đi một nước đe dọa nơi khác (gọi là <em>Đòi cướp / Ko threat</em>) trước khi quay lại ăn cướp.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Ghi nhớ:</strong> Muốn thắng Cướp (Ko), hãy tìm chỗ khác lớn hơn để ép đối thủ phải đỡ!</div>
      `,
      demoInitialPosition: {
        black: [[3, 4], [4, 3], [4, 5], [5, 4]],
        white: [[5, 3], [5, 5], [6, 4]]
      },
      demoSteps: [
        {
          caption: 'Quân Đen F5 đang chỉ còn đúng 1 khí tại E5 (giữa 4 quân).'
        },
        {
          moves: [{ x: 4, y: 4, color: WHITE }],
          caption: 'Trắng đánh E5 (tưởng như tự sát vì E5 không có khí trống nào), nhưng vì ăn được 1 quân Đen F5 nên hoàn toàn hợp lệ!'
        },
        {
          caption: 'Bây giờ Đen KHÔNG ĐƯỢC phép đánh ngay vào F5 để ăn lại (Luật Cướp - Ko). Đen phải đi chỗ khác 1 nước trước.'
        },
        {
          moves: [{ x: 1, y: 1, color: BLACK }],
          caption: 'Đen đi một nước đe dọa ở B8 (Đòi cướp).'
        },
        {
          moves: [{ x: 1, y: 2, color: WHITE }],
          caption: 'Trắng buộc phải đỡ ở B7.'
        },
        {
          moves: [{ x: 5, y: 4, color: BLACK }],
          caption: 'Sau 1 nước trung gian, khóa Cướp được mở: Đen được phép ăn lại tại F5!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Dù F5 trông như bị vây kín, hãy thực hiện nước ăn Cướp (Ko) để bắt quân Trắng E5!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 4], [4, 3], [4, 5]],
          white: [[4, 4], [5, 3], [5, 5], [6, 4]]
        },
        hint: {
          text: 'Quân Trắng E5 chỉ còn 1 khí tại F5. Đánh vào F5 ăn được quân nên không bị tính là tự sát!',
          marker: { x: 5, y: 4, type: 'circle' }
        },
        tree: {
          '5,4': {
            status: 'solved',
            feedback: 'Chính xác! Đen đã ăn quân Trắng E5 và mở ra thế Cướp (Ko): Trắng không được ăn trả ngay vào E5 ở nước kế tiếp.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy kiểm tra khí duy nhất còn lại của quân Trắng E5 (tại F5).'
      }
    },

    // ==================== STAGE 2 ====================
    {
      id: 'lesson-2-1',
      stageId: 'stage-2',
      code: '2.1',
      title: 'Nối (Connect) & Cắt (Cut)',
      jpTerm: 'Tsugi & Kiri (Nối & Cắt)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: '“Nối quân mình, cắt quân địch” — nguyên tắc vàng giúp quân đội vững chắc và chia rẽ đối phương.',
      theoryHtml: `
        <p>Hai quân đứng chéo nhau giống như hai người đứng gần nhưng chưa nắm tay — đối phương có thể chen vào giữa để <strong>Cắt (Kiri)</strong> làm hai mảnh yếu ớt.</p>
        <ul>
          <li><strong>Nối (Tsugi):</strong> Đặt quân vào điểm cắt để hợp nhất hai nhóm quân, gộp chung khí và xóa bỏ điểm yếu.</li>
          <li><strong>Cắt (Kiri):</strong> Khi đối phương hở điểm cắt, hãy chen vào chia cắt để tấn công từng mảnh cô lập.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Danh ngôn cờ vây:</strong> “Ở chỗ có điểm cắt, đừng ngại nối lại — một nhóm mạnh luôn thắng hai nhóm yếu.”</div>
      `,
      demoInitialPosition: {
        black: [[3, 2], [4, 3]],
        white: [[3, 3], [5, 3]]
      },
      demoSteps: [
        {
          caption: 'Đen có hai quân D7 và E6 đứng chéo nhau; Trắng đã đặt sẵn quân ở D6 và F6 để rình cắt.'
        },
        {
          moves: [{ x: 4, y: 2, color: BLACK }],
          caption: 'Đen nối chắc tại E7! Cả 3 quân Đen liên kết chặt chẽ và Trắng F6 lập tức trở thành quân yếu bị chia cắt.'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Quân Đen E7 đang bị Trắng cô lập và chỉ còn 1 khí. Hãy đánh nước Nối vừa cứu quân vừa hợp nhất mặt trận!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 1], [5, 1], [4, 2]],
          white: [[2, 1], [3, 2], [5, 2], [6, 1], [4, 3]]
        },
        hint: {
          text: 'Điểm giao giữa D8, F8 và E7 là giao điểm E8 — nơi nối liền cả 3 quân Đen!',
          marker: { x: 4, y: 1, type: 'circle' }
        },
        tree: {
          '4,1': {
            status: 'solved',
            feedback: 'Tuyệt vời! Nước nối E8 cứu sống quân E7 và liên kết cả 3 quân Đen thành một khối vững chắc với 3 khí ở biên.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Nếu Đen không nối tại E8, Trắng sẽ cắt vào E8 và ăn ngay quân E7.'
      }
    },
    {
      id: 'lesson-2-2',
      stageId: 'stage-2',
      code: '2.2',
      title: 'Song Chiếu / Đánh Đôi (Double Atari)',
      jpTerm: 'Ryoatari (Song Chiếu)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Một nước đi đồng thời đặt hai nhóm quân đối phương vào trạng thái Atari — đối thủ chỉ cứu được một!',
      theoryHtml: `
        <p><strong>Song Chiếu (Double Atari)</strong> là một trong những đòn chiến thuật sảng khoái và hiệu quả nhất cờ vây:</p>
        <ul>
          <li>Khi hai nhóm quân địch cùng chỉ còn 2 khí và có <strong>chung 1 giao điểm khí</strong>, bạn chỉ cần đánh vào giao điểm chung đó.</li>
          <li>Cả hai nhóm địch lập tức rơi vào Atari cùng lúc. Đối phương chỉ kịp chạy 1 nhóm, bạn sẽ ăn trọn nhóm còn lại!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Mẹo:</strong> Luôn đề phòng đừng để hai nhóm quân của chính mình bị chung 1 điểm cắt tạo thành Song Chiếu!</div>
      `,
      demoInitialPosition: {
        black: [[2, 3], [3, 4], [4, 4], [5, 4], [6, 3]],
        white: [[3, 3], [5, 3]]
      },
      demoSteps: [
        {
          caption: 'Hai quân Trắng D6 và F6 đều đang còn 2 khí, và cả hai đều dùng chung khí E6!'
        },
        {
          moves: [{ x: 4, y: 3, color: BLACK }],
          caption: 'Đen đánh E6 → Song Chiếu! Cả D6 lẫn F6 cùng bị Atari cùng lúc.'
        },
        {
          moves: [{ x: 3, y: 2, color: WHITE }],
          caption: 'Trắng cố chạy D6 lên D7...'
        },
        {
          moves: [{ x: 5, y: 2, color: BLACK }],
          caption: '...thì Đen lập tức ăn gọn quân Trắng F6 tại F7!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy tung đòn Song Chiếu vào điểm yếu chung của hai quân Trắng rồi bắt lấy quân còn lại!',
        playerColor: BLACK,
        initialPosition: {
          black: [[2, 3], [3, 4], [4, 4], [5, 4], [6, 3]],
          white: [[3, 3], [5, 3]]
        },
        hint: {
          text: 'Đánh vào giữa D6 và F6 tại E6 để đặt cả hai quân Trắng vào trạng thái còn 1 khí.',
          marker: { x: 4, y: 3, type: 'circle' }
        },
        tree: {
          '4,3': {
            status: 'continue',
            reply: [3, 2],
            feedback: 'Đúng rồi — Song Chiếu! Trắng phải chạy D7. Giờ hãy ăn nốt quân Trắng còn lại!',
            next: {
              '5,2': {
                status: 'solved',
                feedback: 'Hoàn hảo! Đen ăn gọn quân Trắng F6 bằng đòn Song Chiếu mẫu mực.'
              }
            }
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm giao điểm nằm giữa hai quân Trắng (E6) để chiếu cả hai cùng lúc.'
      }
    },
    {
      id: 'lesson-2-3',
      stageId: 'stage-2',
      code: '2.3',
      title: 'Thế Cầu Thang / Chinh (Ladder)',
      jpTerm: 'Shicho (Cầu Thang)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Liên tiếp Atari theo đường zig-zag để dồn quân đối phương vào biên bàn cờ và bắt trọn.',
      theoryHtml: `
        <p><strong>Thế Cầu Thang (Shicho)</strong> xảy ra khi một quân địch chỉ có 2 khí và bạn ép nó chạy theo đường chéo cho đến khi đụng tường biên bàn cờ:</p>
        <ul>
          <li>Mỗi nước bạn đánh luôn ép đối phương chỉ còn đúng 1 khí và chỉ có 1 hướng chạy.</li>
          <li><strong>Cảnh báo cực kỳ quan trọng:</strong> Trước khi đánh Cầu Thang, phải đọc hết đường chéo xem có quân địch nào đứng chắn đường (gọi là <em>Quân Phá Cầu Thang / Ladder Breaker</em>) không! Nếu có, Cầu Thang sẽ phản tác dụng và bạn bị cắt tan nát.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Danh ngôn:</strong> “Không biết đánh Cầu Thang thì chưa thể chơi cờ vây.”</div>
      `,
      demoInitialPosition: {
        black: [[5, 6], [6, 5], [5, 7]],
        white: [[6, 6]]
      },
      demoSteps: [
        {
          caption: 'Quân Trắng G3 chỉ còn 2 khí (H3 và G2). Đen muốn dồn Trắng về góc dưới phải.'
        },
        {
          moves: [{ x: 7, y: 6, color: BLACK }],
          caption: 'Đen chặn H3 (Atari)! Ép Trắng chạy xuống G2.'
        },
        {
          moves: [{ x: 6, y: 7, color: WHITE }],
          caption: 'Trắng chạy G2, vẫn chỉ có 2 khí (G1 và H2).'
        },
        {
          moves: [{ x: 6, y: 8, color: BLACK }],
          caption: 'Đen chặn tiếp G1, ép Trắng rẽ phải sang H2.'
        },
        {
          moves: [{ x: 7, y: 7, color: WHITE }],
          caption: 'Trắng chạy H2 → đụng sát biên dưới!'
        },
        {
          moves: [{ x: 8, y: 7, color: BLACK }, { x: 7, y: 8, color: WHITE }, { x: 8, y: 8, color: BLACK }],
          caption: 'Đen ép tiếp J2 → Trắng H1 → Đen J1 ăn trọn cả 4 quân Trắng!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy thực hiện chuỗi nước Cầu Thang (Shicho) từ H3 để dồn và bắt trọn quân Trắng G3!',
        playerColor: BLACK,
        initialPosition: {
          black: [[5, 6], [6, 5], [5, 7]],
          white: [[6, 6]]
        },
        hint: {
          text: 'Chặn hướng mở rộng sang phải tại H3 để ép Trắng chạy xuống biên dưới.',
          marker: { x: 7, y: 6, type: 'circle' }
        },
        tree: {
          '7,6': {
            status: 'continue',
            reply: [6, 7],
            feedback: 'Tốt! Trắng chạy xuống G2. Tiếp tục bẻ hướng từ phía dưới (G1)!',
            next: {
              '6,8': {
                status: 'continue',
                reply: [7, 7],
                feedback: 'Chính xác! Trắng chạy H2. Chặn bên phải (J2) để ép sát góc!',
                next: {
                  '8,7': {
                    status: 'continue',
                    reply: [7, 8],
                    feedback: 'Trắng chỉ còn đường cùng H1! Hãy đánh J1 để bắt trọn cả 4 quân Trắng!',
                    next: {
                      '8,8': {
                        status: 'solved',
                        feedback: 'Xuất sắc! Bạn đã thực hiện hoàn hảo một chuỗi Cầu Thang và bắt gọn 4 quân Trắng!'
                      }
                    }
                  }
                }
              }
            }
          },
          '6,7': {
            status: 'wrong',
            reply: [7, 6],
            feedback: 'Nếu đánh G2 trước, Trắng chạy ra H3 hướng vào vùng trống và thoát khỏi Cầu Thang!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy luôn đánh từ phía chặn không gian rộng (Atari liên tục theo hình bậc thang).'
      }
    },
    {
      id: 'lesson-2-4',
      stageId: 'stage-2',
      code: '2.4',
      title: 'Thế Lưới / Già (Net / Geta)',
      jpTerm: 'Geta (Cái Guốc / Thế Lưới)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Khi Cầu Thang bị phá bởi quân đón đầu, hãy lùi 1 bước giăng Lưới để vây chết quân địch từ xa.',
      theoryHtml: `
        <p>Khi một quân địch có 2 khí nhưng <strong>Thế Cầu Thang thất bại</strong> vì có quân địch đón sẵn trên đường chéo (như quân Trắng ở H2 trong bài này), bạn phải chuyển sang <strong>Thế Lưới (Geta)</strong>.</p>
        <ul>
          <li>Thay vì chạm sát để Atari (vô tình đẩy địch chạy thoát), bạn đánh cách một đường chéo để <strong>bịt đường thoát tổng thể</strong>.</li>
          <li>Dù đối phương chạy sang trái hay xuống dưới, bạn đều có thể chặn đầu dễ dàng.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khẩu quyết:</strong> “Cầu Thang không thành thì giăng Lưới (Geta).”</div>
      `,
      demoInitialPosition: {
        black: [[3, 4], [4, 3], [5, 3], [3, 5]],
        white: [[4, 4], [7, 7]]
      },
      demoSteps: [
        {
          caption: 'Trắng E5 đang bị ép, nhưng ở góc dưới phải (H2) có sẵn một quân Trắng đón đầu nên Cầu Thang sẽ thất bại!'
        },
        {
          moves: [{ x: 5, y: 5, color: BLACK }],
          caption: 'Đen giăng Lưới tại F4 (cách chéo E5)! Bây giờ Trắng bị nhốt hoàn toàn trong lồng.'
        },
        {
          moves: [{ x: 5, y: 4, color: WHITE }],
          caption: 'Nếu Trắng cố lao sang F5...'
        },
        {
          moves: [{ x: 6, y: 4, color: BLACK }, { x: 4, y: 5, color: WHITE }, { x: 4, y: 6, color: BLACK }],
          caption: '...Đen chặn G5, Trắng xuống E4, Đen khóa E3 → bắt trọn cả 3 quân Trắng!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Vì có quân Trắng H2 phá Cầu Thang, hãy giăng Thế Lưới (Geta) để vây bắt quân Trắng E5!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 4], [4, 3], [5, 3], [3, 5]],
          white: [[4, 4], [7, 7]]
        },
        hint: {
          text: 'Đừng chạm sát E5! Hãy đánh vào giao điểm chéo F4 để khóa cả hai hướng thoát F5 và E4.',
          marker: { x: 5, y: 5, type: 'circle' }
        },
        tree: {
          '5,5': {
            status: 'continue',
            reply: [5, 4],
            feedback: 'Tuyệt vời! Trắng cố chạy sang F5. Hãy chặn bên ngoài tại G5!',
            next: {
              '6,4': {
                status: 'continue',
                reply: [4, 5],
                feedback: 'Trắng giãy sang E4. Hãy đánh E3 để đóng sập cái lưới!',
                next: {
                  '4,6': {
                    status: 'solved',
                    feedback: 'Hoàn hảo! Toàn bộ 3 quân Trắng bị bắt gọn trong Thế Lưới bất chấp quân đón đầu H2!'
                  }
                }
              }
            }
          },
          '5,4': {
            status: 'wrong',
            reply: [4, 5],
            feedback: 'Cầu Thang thất bại! Trắng chạy E4 và liên kết thẳng tới quân đón đầu H2.'
          },
          '4,5': {
            status: 'wrong',
            reply: [5, 4],
            feedback: 'Chạm sát E4 làm Trắng lao sang F5 và thoát ra ngoài!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy lùi ra một bước chéo tại F4 để giăng Lưới khóa chặt đường thoát của Trắng.'
      }
    },
    {
      id: 'lesson-2-5',
      stageId: 'stage-2',
      code: '2.5',
      title: 'Hồi Mã Thương / Đánh Rút (Snapback)',
      jpTerm: 'Uttegaeshi (Hồi Mã Thương)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Hy sinh 1 quân để ép đối thủ ăn và tự đẩy mình vào thế chỉ còn 1 khí, rồi phản công ăn trọn!',
      theoryHtml: `
        <p><strong>Hồi Mã Thương (Snapback)</strong> là đòn hy sinh kinh điển để lật ngược thế cờ tưởng chừng đã nối kín:</p>
        <ul>
          <li>Bạn cố tình đặt <strong>1 quân</strong> vào thế chỉ còn 1 khí, nhưng đồng thời đẩy cả đám quân địch vào thế Atari.</li>
          <li>Khi đối phương ăn 1 quân của bạn, đám quân của họ chỉ còn đúng 1 khí tại chính ô vừa bị ăn — bạn <strong>đánh ngược lại ngay lập tức</strong> (không bị luật Cướp cấm, vì đối thủ vừa ăn nhưng nhóm của họ lớn hơn 1 quân!) và bắt trọn cả đám địch.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Bí quyết:</strong> Chú ý phân biệt với Ko — Snapback được phép ăn trả ngay lập tức vì nhóm địch có từ 2 quân trở lên!</div>
      `,
      demoInitialPosition: {
        black: [[1, 0], [1, 1], [2, 2], [3, 2], [4, 2], [5, 2], [6, 1], [6, 0]],
        white: [[2, 0], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]]
      },
      demoSteps: [
        {
          caption: 'Đám 6 quân Trắng trông rất kín, chỉ có 2 khoảng trống bên trong là D9 và E9.'
        },
        {
          moves: [{ x: 3, y: 0, color: BLACK }],
          caption: 'Đen ném 1 quân hy sinh vào D9! Nước này đặt cả đám 6 quân Trắng vào thế Atari.'
        },
        {
          moves: [{ x: 4, y: 0, color: WHITE }],
          caption: 'Trắng buộc phải ăn tại E9 — nhưng khi ăn xong, cả 7 quân Trắng chỉ còn đúng 1 khí ở D9!'
        },
        {
          moves: [{ x: 3, y: 0, color: BLACK }],
          caption: 'Hồi Mã Thương! Đen đánh trả ngay vào D9 (không bị luật Ko cấm) và ăn trọn cả 7 quân Trắng!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy dùng đòn Hồi Mã Thương (hy sinh 1 quân rồi ăn ngược lại) để bắt trọn cả cụm quân Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[1, 0], [1, 1], [2, 2], [3, 2], [4, 2], [5, 2], [6, 1], [6, 0]],
          white: [[2, 0], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]]
        },
        hint: {
          text: 'Hãy ném 1 quân vào D9 (hoặc E9) để ép Trắng ăn vào chỗ chết.',
          marker: { x: 3, y: 0, type: 'circle' }
        },
        tree: {
          '3,0': {
            status: 'continue',
            reply: [4, 0],
            feedback: 'Hay lắm! Trắng buộc phải ăn vào E9 và tự nhốt mình còn 1 khí. Giờ hãy đánh ngược vào D9!',
            next: {
              '3,0': {
                status: 'solved',
                feedback: 'Tuyệt đỉnh! Đen đã ăn trọn 7 quân Trắng bằng đòn Hồi Mã Thương (Snapback)!'
              }
            }
          },
          '4,0': {
            status: 'continue',
            reply: [3, 0],
            feedback: 'Hay lắm! Trắng buộc phải ăn vào D9 và tự nhốt mình còn 1 khí. Giờ hãy đánh ngược vào E9!',
            next: {
              '4,0': {
                status: 'solved',
                feedback: 'Tuyệt đỉnh! Đen đã ăn trọn 7 quân Trắng bằng đòn Hồi Mã Thương (Snapback)!'
              }
            }
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Đừng đánh ở ngoài — hãy ném 1 quân vào khoảng trống bên trong (D9 hoặc E9).'
      }
    },
    {
      id: 'lesson-2-6',
      stageId: 'stage-2',
      code: '2.6',
      title: 'Cuộc Đua Khí (Capturing Race)',
      jpTerm: 'Semeai (Đua Khí)',
      difficulty: 'Cơ bản',
      boardSize: 9,
      summary: 'Khi hai đám quân cùng bị vây không có mắt, bên nào đếm khí chuẩn hơn và cướp khí ngoài trước sẽ thắng.',
      theoryHtml: `
        <p><strong>Đua Khí (Semeai)</strong> xảy ra khi hai nhóm quân áp sát nhau và đều chưa sống. Ai hết khí trước sẽ bị bắt toàn bộ!</p>
        <ul>
          <li><strong>Nguyên tắc 1:</strong> Đếm chính xác số khí của cả hai bên (tính cả <em>khí chung / dame</em>).</li>
          <li><strong>Nguyên tắc 2:</strong> Luôn đánh để <strong>lấy khí bên ngoài của đối thủ trước</strong>, thay vì chạy một cách thụ động nếu chạy không tăng thêm được khí.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khẩu quyết Semeai:</strong> “Lấy khí từ ngoài vào trong; bên nhiều khí hơn chỉ 1 khí là bên thắng!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 1], [1, 1], [1, 2], [0, 4], [1, 4], [2, 3], [3, 2], [4, 1], [4, 0]],
        white: [[0, 2], [0, 3], [1, 3], [2, 2], [2, 1]]
      },
      demoSteps: [],
      puzzle: {
        prompt: 'Đen đi trước: Đen góc và Trắng mỗi bên đều còn đúng 2 khí. Hãy đánh nước cướp khí ngoài chính xác để thắng cuộc Đua Khí (Semeai)!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 1], [1, 1], [1, 2], [0, 4], [1, 4], [2, 3], [3, 2], [4, 1], [4, 0]],
          white: [[0, 2], [0, 3], [1, 3], [2, 2], [2, 1]]
        },
        hint: { text: '', marker: { x: 2, y: 0, type: 'circle' } },
        tree: {},
        defaultWrongFeedback: ''
      }
    },

    // ==================== STAGE 3 ====================
    {
      id: 'lesson-3-1',
      stageId: 'stage-3',
      code: '3.1',
      title: 'Nguyên Tắc Hai Mắt Sống',
      jpTerm: 'Nikame (Hai Mắt Sống)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Một nhóm quân chỉ bất tử khi có ít nhất Hai Mắt Thật tách biệt nhau.',
      theoryHtml: `
        <p>Tại sao một nhóm quân chỉ có <strong>1 mắt</strong> vẫn chết, còn có <strong>2 mắt</strong> thì sống vĩnh viễn?</p>
        <ul>
          <li>Vì theo <strong>Luật Tự Sát</strong>, đối phương không thể đặt quân vào mắt của bạn trừ khi nước đó bắt được toàn bộ nhóm quân bạn.</li>
          <li>Nếu bạn chỉ có <strong>1 mắt</strong>, khi bị vây hết khí ngoài, đối phương được phép đi vào mắt cuối đó để ăn sạch bạn.</li>
          <li>Nếu bạn có <strong>2 mắt riêng biệt</strong>, đối phương đánh vào mắt nào cũng là tự sát (vì mắt kia vẫn còn 1 khí cho bạn) — nhóm quân của bạn <strong>Bất Tử (Sống)</strong>!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Quy tắc vàng:</strong> “Không gian 3 ô thẳng hàng (Tam Trực) — đánh vào điểm giữa là sống!”</div>
      `,
      demoInitialPosition: {
        black: [[1, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]],
        white: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 1], [6, 0]]
      },
      demoSteps: [
        {
          caption: 'Đám Đen ở biên trên bị Trắng vây kín, bên trong chỉ có một khoảng trống 3 ô thẳng hàng (C9, D9, E9).'
        },
        {
          moves: [{ x: 3, y: 0, color: BLACK }],
          caption: 'Đen đánh vào điểm giữa D9! Khoảng trống lập tức tách thành 2 mắt thật riêng biệt tại C9 và E9 — Đen sống hoàn toàn!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy tạo Hai Mắt Thật để cứu sống đám quân Đen đang bị vây kín ở biên trên!',
        playerColor: BLACK,
        initialPosition: {
          black: [[1, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]],
          white: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 1], [6, 0]]
        },
        hint: {
          text: 'Hãy chia đôi khoảng trống 3 ô bằng cách đánh vào chính giữa (D9).',
          marker: { x: 3, y: 0, type: 'circle' }
        },
        tree: {
          '3,0': {
            status: 'solved',
            feedback: 'Chính xác! D9 chia không gian làm hai mắt tách biệt (C9 và E9). Đám Đen đã sống bất tử!'
          },
          '2,0': {
            status: 'wrong',
            reply: [3, 0],
            feedback: 'Đánh lệch sang C9 khiến Trắng chiếm ngay điểm giữa D9 — Đen chỉ còn 1 mắt và chết toàn bộ!'
          },
          '4,0': {
            status: 'wrong',
            reply: [3, 0],
            feedback: 'Đánh lệch sang E9 khiến Trắng chiếm ngay điểm giữa D9 — Đen không thể tạo 2 mắt!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm giao điểm chia không gian 3 ô thành 2 mắt riêng biệt.'
      }
    },
    {
      id: 'lesson-3-2',
      stageId: 'stage-3',
      code: '3.2',
      title: 'Mắt Thật & Mắt Giả (False Eye)',
      jpTerm: 'Kakeme (Mắt Giả)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Mắt có đường chéo bị địch kiểm soát và không thể nối liền tường sẽ trở thành Mắt Giả và bị phá vỡ.',
      theoryHtml: `
        <p>Đừng thấy một ô trống bị quân mình bao quanh 4 phía là vội mừng — đó có thể là <strong>Mắt Giả (Kakeme)</strong>!</p>
        <ul>
          <li>Cách kiểm tra nhanh: Ở <strong>góc hoặc biên</strong>, nếu bất kỳ <em>ô chéo</em> nào của mắt bị địch chiếm (hoặc sắp chiếm) khiến hai mảnh tường quanh mắt không nối được với nhau → đó là <strong>Mắt Giả</strong>.</li>
          <li>Ở <strong>giữa bàn</strong>, nếu có từ <strong>2 ô chéo trở lên</strong> bị địch kiểm soát → mắt đó có nguy cơ là Mắt Giả.</li>
          <li>Khi bị ép Atari vào tường mắt giả, bạn buộc phải tự lấp mắt đó lại!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Cảnh giác:</strong> “Một mắt thật cộng một mắt giả vẫn là CHẾT!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 1], [4, 0]],
        white: [[0, 1], [1, 0], [2, 1], [3, 0], [3, 1]]
      },
      demoSteps: [
        {
          caption: 'Trắng ở góc trên trái trông như có 2 mắt ở A9 và C9. Nhưng hãy kiểm tra ô chéo B8!'
        },
        {
          moves: [{ x: 1, y: 1, color: BLACK }],
          caption: 'Đen đánh vào B8! Ô này đặt quân Trắng A8 vào thế Atari và biến mắt A9 thành Mắt Giả.'
        },
        {
          moves: [{ x: 0, y: 0, color: WHITE }],
          caption: 'Nếu Trắng nối tại A9 thì tự lấp mắt của mình và chỉ còn 1 mắt (C9) → chết toàn bộ!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Đám Trắng trông như có 2 mắt (A9 và C9), nhưng một trong hai là Mắt Giả. Hãy đánh vào điểm làm sụp đổ mắt của Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 1], [4, 0]],
          white: [[0, 1], [1, 0], [2, 1], [3, 0], [3, 1]]
        },
        hint: {
          text: 'Hãy kiểm tra giao điểm chéo của mắt góc A9 — đó chính là điểm B8!',
          marker: { x: 1, y: 1, type: 'circle' }
        },
        tree: {
          '1,1': {
            status: 'solved',
            feedback: 'Quá chuẩn! Đen đánh B8 khiến A9 lộ nguyên hình là Mắt Giả và bắt buộc Trắng A8 phải chịu chết hoặc tự bịt mắt!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm giao điểm chéo quyết định tính sống-còn của mắt góc A9.'
      }
    },
    {
      id: 'lesson-3-3',
      stageId: 'stage-3',
      code: '3.3',
      title: 'Điểm Sống Chết (Vital Point)',
      jpTerm: 'Kyusho (Yếu Điểm)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: '“Yếu điểm của đối phương chính là yếu điểm của ta” — chiếm trước điểm giữa của Tam Trực để giết địch.',
      theoryHtml: `
        <p>Một trong những câu châm ngôn nổi tiếng nhất mọi thời đại của cờ vây là: <strong>“Điểm sống của địch cũng chính là điểm giết của ta.”</strong></p>
        <ul>
          <li>Khi đối phương có không gian hình <strong>Tam Trực</strong> (3 ô thẳng hàng), điểm giữa là yếu điểm sống-chết.</li>
          <li>Nếu bạn đặt quân vào điểm giữa đó trước, không gian còn lại không thể chia làm 2 mắt nữa. Dù đối phương có ăn quân bạn vừa đặt thì hình dạng còn lại vẫn chỉ tạo ra được 1 mắt!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Châm ngôn:</strong> “Điểm đẹp của đối phương chính là điểm đẹp của mình.”</div>
      `,
      demoInitialPosition: {
        black: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 1], [6, 0]],
        white: [[1, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]]
      },
      demoSteps: [
        {
          caption: 'Trắng đang có khoảng trống 3 ô thẳng hàng (C9, D9, E9). Nếu đến lượt Trắng, Trắng đi D9 là sống.'
        },
        {
          moves: [{ x: 3, y: 0, color: BLACK }],
          caption: 'Nhưng Đen đi trước và chiếm ngay D9! Giờ dù Trắng có bắt được quân D9 (bằng cách đánh C9 rồi E9), không gian 3 ô vẫn chỉ tạo thành 1 mắt.'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy đánh vào Yếu Điểm (Vital Point) để tiêu diệt hoàn toàn đám Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 1], [6, 0]],
          white: [[1, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [5, 0]]
        },
        hint: {
          text: 'Điểm sống của Trắng nằm ngay chính giữa 3 ô trống ở biên trên (D9).',
          marker: { x: 3, y: 0, type: 'circle' }
        },
        tree: {
          '3,0': {
            status: 'solved',
            feedback: 'Chính xác! Chiếm D9 phá tan mọi cơ hội tạo 2 mắt của Trắng — toàn bộ đám Trắng đã chết!'
          },
          '2,0': {
            status: 'wrong',
            reply: [3, 0],
            feedback: 'Sai hướng! Trắng đánh ngay D9 và sống với 2 mắt!'
          },
          '4,0': {
            status: 'wrong',
            reply: [3, 0],
            feedback: 'Sai hướng! Trắng chiếm D9 và sống ngay lập tức!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy nhớ nguyên tắc: Yếu điểm của địch cũng là yếu điểm của mình.'
      }
    },
    {
      id: 'lesson-3-4',
      stageId: 'stage-3',
      code: '3.4',
      title: 'Phá Mắt Nakade (Hình Nắm Đấm)',
      jpTerm: 'Nakade (Đặt Quân Giữa Phá Mắt)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Các hình mắt chết kinh điển (3 thẳng, 4 vuông, 5 nắm đấm, 6 hoa mai) đều có 1 yếu điểm Nakade duy nhất.',
      theoryHtml: `
        <p><strong>Nakade</strong> là kỹ thuật đặt một quân (hoặc hình cờ chết) vào bên trong không gian mắt rộng của đối phương để khiến khi đối phương ăn được quân đó, họ chỉ còn lại một không gian nhỏ không đủ làm 2 mắt.</p>
        <p><strong>Bảng tra các hình mắt chết kinh điển (Nakade):</strong></p>
        <ul>
          <li><strong>3 ô thẳng / cong:</strong> Chết nếu bạn đánh vào ô giữa.</li>
          <li><strong>4 ô vuông (2×2):</strong> Luôn chết!</li>
          <li><strong>5 ô Nắm Đấm (Bulky Five — 4 vuông + 1 tai):</strong> Đánh vào giao điểm nối liền với 3 ô (điểm tâm).</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khẩu quyết:</strong> “Tam, Tứ vuông, Ngũ quy, Lục hoa mai — đều có đúng 1 điểm Nakade chí mạng.”</div>
      `,
      demoInitialPosition: {
        black: [[0, 3], [1, 3], [2, 3], [3, 3], [4, 2], [5, 1], [5, 0]],
        white: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [3, 1], [4, 1], [4, 0]]
      },
      demoSteps: [
        {
          caption: 'Trắng có không gian 5 ô hình Nắm Đấm (Bulky Five): B9, C9, D9, B8, C8.'
        },
        {
          moves: [{ x: 2, y: 0, color: BLACK }],
          caption: 'Đen đánh Nakade vào điểm tâm C9! C9 vừa chặn D9 vừa tiếp giáp B9 và C8.'
        },
        {
          moves: [{ x: 1, y: 1, color: WHITE }, { x: 1, y: 0, color: BLACK }, { x: 2, y: 1, color: WHITE }],
          caption: 'Dù Trắng có vây chặt và ăn các quân Đen bên trong, không gian còn lại thu hẹp về 3 ô thẳng hàng → Trắng chỉ tạo được 1 mắt và chết!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Trắng có 5 ô không gian hình Nắm Đấm (Bulky Five). Hãy đánh vào điểm Nakade duy nhất để giết Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 3], [1, 3], [2, 3], [3, 3], [4, 2], [5, 1], [5, 0]],
          white: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [3, 1], [4, 1], [4, 0]]
        },
        hint: {
          text: 'Hãy tìm giao điểm nằm ở giữa hàng trên tiếp giáp với 3 ô trống khác (C9).',
          marker: { x: 2, y: 0, type: 'circle' }
        },
        tree: {
          '2,0': {
            status: 'solved',
            feedback: 'Quá chuẩn! Điểm C9 là yếu điểm Nakade của hình Nắm Đấm — Trắng không thể tách thành 2 mắt được nữa!'
          },
          '2,1': {
            status: 'wrong',
            reply: [2, 0],
            feedback: 'Sai! Trắng đánh ngay C9, tách D9 thành 1 mắt và cụm B9-B8 thành mắt thứ hai → Trắng sống!'
          },
          '1,1': {
            status: 'wrong',
            reply: [2, 0],
            feedback: 'Sai! Trắng đánh C9 và tạo thành 2 mắt sống rõ rệt!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Nếu bạn không đánh vào C9, Trắng sẽ chiếm C9 để tách thành 2 mắt.'
      }
    },
    {
      id: 'lesson-3-5',
      stageId: 'stage-3',
      code: '3.5',
      title: 'Thế Song Sống (Seki)',
      jpTerm: 'Seki (Song Sống)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Khi cả hai bên không thể có đủ 2 mắt nhưng ai đánh vào điểm chung trước đều tự sát, cả hai cùng sống!',
      theoryHtml: `
        <p><strong>Song Sống (Seki)</strong> là trạng thái hòa bình đặc biệt trong cờ vây:</p>
        <ul>
          <li>Cả nhóm Đen và nhóm Trắng đứng đối mặt nhau, cùng dùng chung các khí (gọi là <em>Dame</em>).</li>
          <li><strong>Ai đánh vào khí chung trước sẽ tự đưa mình xuống còn 1 khí</strong> và bị đối thủ ăn sạch ngay nước sau!</li>
          <li>Vì thế, cả hai bên đều không dám đánh thêm — kết thúc ván, cả hai nhóm đều được tính là <strong>Sống</strong> (không bên nào bị tính tù binh, các ô trống trong Seki không tính điểm đất).</li>
        </ul>
        <div class="proverb-box">💡 <strong>Mẹo thực chiến:</strong> Khi thấy quân mình không đủ làm 2 mắt, hãy tìm cách đưa thế cờ về Seki để cứu vãn!</div>
      `,
      demoInitialPosition: {
        black: [[0, 1], [1, 0], [0, 3], [1, 3], [2, 3], [3, 3], [4, 2], [5, 1], [6, 1], [6, 0]],
        white: [[0, 2], [1, 2], [2, 2], [2, 1], [3, 2], [3, 1], [3, 0], [4, 1], [5, 0]]
      },
      demoSteps: [
        {
          caption: 'Đen A8 và B9 đang tách rời; Trắng đã có 1 mắt tại E9 và đang dọa đánh B8 để tiêu diệt cả hai quân Đen.'
        },
        {
          moves: [{ x: 1, y: 1, color: BLACK }],
          caption: 'Đen nối chắc tại B8! Giờ Đen có 1 mắt (A9) + 1 khí chung (C9), và Trắng cũng có 1 mắt (E9) + 1 khí chung (C9).'
        },
        {
          caption: 'Thế Song Sống (Seki) hình thành! Nếu Đen đánh C9 → Trắng ăn tại A9. Nếu Trắng đánh C9 → Đen ăn tại E9. Vì vậy cả hai cùng sống!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Đám Đen ở góc trên trái không thể tạo 2 mắt. Hãy đi nước chính xác để thiết lập thế Song Sống (Seki) cứu toàn bộ đám quân!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 1], [1, 0], [0, 3], [1, 3], [2, 3], [3, 3], [4, 2], [5, 1], [6, 1], [6, 0]],
          white: [[0, 2], [1, 2], [2, 2], [2, 1], [3, 2], [3, 1], [3, 0], [4, 1], [5, 0]]
        },
        hint: {
          text: 'Hãy nối A8 và B9 lại tại giao điểm B8 để tạo 1 mắt thật (A9) và giữ khí chung C9.',
          marker: { x: 1, y: 1, type: 'circle' }
        },
        tree: {
          '1,1': {
            status: 'solved',
            feedback: 'Xuất sắc! Bạn đã nối thành công tại B8 để lập thế Song Sống (Seki) — cả hai bên đều không dám đánh vào C9!'
          },
          '2,0': {
            status: 'wrong',
            reply: [1, 1],
            feedback: 'Sai lầm! Trắng chém ngay vào B8 ăn gọn B9 và C9, toàn bộ góc Đen bị tiêu diệt!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Đen cần nối hai quân góc lại ở B8 trước khi Trắng cắt vào đó.'
      }
    },

    // ==================== STAGE 4 ====================
    {
      id: 'lesson-4-1',
      stageId: 'stage-4',
      code: '4.1',
      title: 'Hình Cờ Đẹp: Nối Tre vs Tam Giác Rỗng',
      jpTerm: 'Takefu (Nối Tre) & Aki Sankaku',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Nối Tre (Bamboo Joint) liên kết cực kỳ linh hoạt và không thể cắt; tránh Tam Giác Rỗng (Empty Triangle) nặng nề.',
      theoryHtml: `
        <p><strong>Hình cờ (Shape)</strong> quyết định sức mạnh và tốc độ phát triển của quân bạn:</p>
        <ul>
          <li><strong>Tam Giác Rỗng (Empty Triangle):</strong> 3 quân xếp thành hình chữ L quanh 1 ô trống. Đây là hình cờ rất xấu vì bị tụt khí và không mở rộng được không gian.</li>
          <li><strong>Nối Tre (Takefu / Bamboo Joint):</strong> Hai cặp quân song song (ví dụ <code>C6-D6</code> và <code>C4-D4</code>). Dù đối phương đặt quân vào giữa bên nào, bạn luôn đi bên còn lại để nối liền 100%!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Khẩu quyết:</strong> “Thấy Tam Giác Rỗng hãy dừng lại suy nghĩ 2 lần — Nối Tre mạnh gấp bội!”</div>
      `,
      demoInitialPosition: {
        black: [[2, 3], [3, 3], [2, 5]],
        white: [[1, 4], [4, 4]]
      },
      demoSteps: [
        {
          caption: 'Đen cần liên kết cụm D6-C6 với quân C4 bên dưới đang bị hai quân Trắng B5, E5 ép sát.'
        },
        {
          moves: [{ x: 3, y: 5, color: BLACK }],
          caption: 'Đen đánh D4 tạo hình Nối Tre (Bamboo Joint)! Cả 4 quân nối với nhau cực đẹp và có rất nhiều khí.'
        },
        {
          moves: [{ x: 2, y: 4, color: WHITE }, { x: 3, y: 4, color: BLACK }],
          caption: 'Nếu Trắng cắt vào C5, Đen chỉ việc nối tại D5 — liên kết hoàn toàn không thể bị cắt đứt!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy chọn nước đi tạo Hình Cờ Nối Tre (Bamboo Joint) để nối cụm trên và quân dưới một cách bất khả xâm phạm (tránh Tam Giác Rỗng)!',
        playerColor: BLACK,
        initialPosition: {
          black: [[2, 3], [3, 3], [2, 5]],
          white: [[1, 4], [4, 4]]
        },
        hint: {
          text: 'Hãy hoàn thành cặp song song bên dưới tại giao điểm D4.',
          marker: { x: 3, y: 5, type: 'circle' }
        },
        tree: {
          '3,5': {
            status: 'solved',
            feedback: 'Chuẩn xác! Hình Nối Tre (D4) liên kết chắc nịch 100%, vừa rộng khí vừa không tạo Tam Giác Rỗng nặng nề.'
          },
          '2,4': {
            status: 'wrong',
            reply: [3, 4],
            feedback: 'Bạn vừa tạo ra Tam Giác Rỗng (C6-D6-C5)! Trắng lập tức cắt D5 làm quân Đen bị bí.'
          },
          '3,4': {
            status: 'wrong',
            reply: [2, 4],
            feedback: 'Bạn vừa tạo Tam Giác Rỗng (C6-D6-D5)! Trắng đánh C5 chia cắt quân C4 ở dưới.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy hoàn chỉnh hình Nối Tre bằng cách đánh đối xứng ở D4.'
      }
    },
    {
      id: 'lesson-4-2',
      stageId: 'stage-4',
      code: '4.2',
      title: 'Thủ Cân: Bẻ Đầu Hai Quân',
      jpTerm: 'Nidan-no-atama ni Hane',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Khi hai hàng quân sát nhau theo chiều ngang, nước bẻ lên đầu hai quân địch tạo sức ép cực lớn.',
      theoryHtml: `
        <p><strong>“Đầu hai quân, nhất định phải bẻ (Hane)”</strong> — đây là câu cách ngôn chiến thuật nổi tiếng nhất về Thủ Cân (Tesuji):</p>
        <ul>
          <li>Khi 2 quân của bạn nằm song song áp sát 2 quân đối phương, phía mở (đầu hàng quân) chính là nơi tranh chấp khí và không gian.</li>
          <li>Nếu bạn đánh <strong>Bẻ (Hane)</strong> lên đầu 2 quân địch, số khí của địch bị thu hẹp mạnh còn bạn lại vươn ra chiếm lĩnh không gian.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Cách ngôn:</strong> “Gặp đầu hai quân phải Bẻ (Hane); gặp đầu ba quân càng phải Bẻ!”</div>
      `,
      demoInitialPosition: {
        black: [[2, 4], [3, 3], [4, 3]],
        white: [[2, 5], [3, 4], [4, 4]]
      },
      demoSteps: [
        {
          caption: 'Hai quân Đen D6-E6 và hai quân Trắng D5-E5 đang áp sát nhau. Đầu bên trái đã có Đen C5 khóa lại.'
        },
        {
          moves: [{ x: 5, y: 4, color: BLACK }],
          caption: 'Đen bẻ xuống đầu hai quân Trắng tại F5 (Hane)! Trắng bị ép chặt khí và mất hoàn toàn thế phát triển sang phải.'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy áp dụng cách ngôn “Bẻ đầu hai quân” để áp đảo cụm Trắng D5-E5!',
        playerColor: BLACK,
        initialPosition: {
          black: [[2, 4], [3, 3], [4, 3]],
          white: [[2, 5], [3, 4], [4, 4]]
        },
        hint: {
          text: 'Hãy bẻ vào phía đầu bên phải của hai quân Trắng tại F5.',
          marker: { x: 5, y: 4, type: 'circle' }
        },
        tree: {
          '5,4': {
            status: 'solved',
            feedback: 'Tuyệt vời! Nước bẻ đầu F5 khống chế hoàn toàn hai quân Trắng và mở rộng tầm ảnh hưởng của Đen!'
          },
          '5,3': {
            status: 'wrong',
            reply: [5, 4],
            feedback: 'Nối dài F6 quá hiền! Trắng lập tức bẻ ngược lại F5, giành mất ưu thế khí và hình cờ.'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Đừng đi thẳng F6 — hãy bẻ chéo xuống F5 đúng vào đầu hai quân Trắng.'
      }
    },
    {
      id: 'lesson-4-3',
      stageId: 'stage-4',
      code: '4.3',
      title: 'Thủ Cân: Điểm 1-1 Phá Mắt Góc',
      jpTerm: '1-1 no Kyusho (Yếu điểm 1-1)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Ở góc bàn cờ, giao điểm 1-1 đôi khi lại là nước Thủ Cân kỳ diệu để phá mắt và giết địch.',
      theoryHtml: `
        <p>Thông thường người mới chơi tránh đánh vào đường 1 (đặc biệt là 4 góc <strong>1-1</strong>). Nhưng trong các thế Tsumego góc, điểm 1-1 thường xuyên là <strong>Thủ Cân duy nhất</strong>:</p>
        <ul>
          <li>Nếu bạn đánh bên cạnh (1-2 hoặc 2-1), đối phương chỉ cần chiếm ngay điểm 1-1 để biến thành 2 mắt nhỏ riêng biệt ở 2 bên.</li>
          <li>Khi bạn đặt quân vào chính điểm <strong>1-1</strong> trước, đối thủ không thể tách mắt và toàn bộ nhóm góc sẽ bị giảm xuống còn 1 mắt!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Ghi nhớ:</strong> “Không có chỗ chết nào không thử điểm 1-1 trước khi bỏ cuộc!”</div>
      `,
      demoInitialPosition: {
        black: [[0, 3], [1, 3], [2, 2], [3, 1], [3, 0]],
        white: [[0, 2], [1, 2], [1, 1], [2, 1], [2, 0]]
      },
      demoSteps: [
        {
          caption: 'Trắng ở góc trên trái có 3 điểm trống (A9, B9, A8). Nếu Đen đánh sai, Trắng sẽ tách thành 2 mắt!'
        },
        {
          moves: [{ x: 0, y: 0, color: BLACK }],
          caption: 'Đen đánh thẳng vào điểm 1-1 (A9)! Quân A9 có 2 khí (B9 và A8), Trắng không thể tự sát để bắt ngay.'
        },
        {
          moves: [{ x: 1, y: 0, color: BLACK }],
          caption: 'Nước sau Đen chỉ việc đánh B9 hoặc A8 để Atari, biến toàn bộ góc Trắng thành 1 mắt chết!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy tìm Thủ Cân tại góc trên trái để phá mắt và tiêu diệt cụm Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[0, 3], [1, 3], [2, 2], [3, 1], [3, 0]],
          white: [[0, 2], [1, 2], [1, 1], [2, 1], [2, 0]]
        },
        hint: {
          text: 'Hãy thử nước đi táo bạo ngay tại đỉnh góc 1-1 (A9)!',
          marker: { x: 0, y: 0, type: 'circle' }
        },
        tree: {
          '0,0': {
            status: 'solved',
            feedback: 'Chính xác! Điểm 1-1 (A9) phá vỡ hoàn toàn khả năng tạo 2 mắt của Trắng!'
          },
          '1,0': {
            status: 'wrong',
            reply: [0, 0],
            feedback: 'Sai! Trắng đánh A9 ăn quân B9, lập tức có 2 mắt riêng biệt tại B9 và A8 → Trắng sống!'
          },
          '0,1': {
            status: 'wrong',
            reply: [0, 0],
            feedback: 'Sai! Trắng đánh A9 ăn quân A8 và tạo ngay 2 mắt riêng biệt ở góc → Trắng sống!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy kiểm tra các điểm bên trong góc, đặc biệt là điểm 1-1 (A9).'
      }
    },
    {
      id: 'lesson-4-4',
      stageId: 'stage-4',
      code: '4.4',
      title: 'Phòng Thủ Bằng Miệng Hổ',
      jpTerm: 'Kake-tsugi (Miệng Hổ / Treo Nối)',
      difficulty: 'Trung cấp',
      boardSize: 9,
      summary: 'Miệng Hổ (Tiger’s Mouth) vừa giữ liên kết vừa tránh hình cờ nặng nề, biến điểm cắt thành cái bẫy.',
      theoryHtml: `
        <p>Khi hai quân của bạn đứng chéo nhau (ví dụ <code>D6</code> và <code>E5</code>) và bị địch đe dọa cắt đôi:</p>
        <ul>
          <li>Nếu bạn nối thẳng vào điểm cắt <code>E6</code>, đôi khi đó lại là hình <strong>Tam Giác Rỗng</strong> nặng nề.</li>
          <li>Thay vào đó, bạn có thể dùng nước <strong>Miệng Hổ (Hanging Connection)</strong> ở <code>F6</code>: nếu đối phương dám chui vào điểm cắt <code>E6</code>, nó sẽ rơi thẳng vào “miệng hổ” chỉ còn 1 khí và bị bạn đớp gọn!</li>
        </ul>
        <div class="proverb-box">💡 <strong>Thủ pháp:</strong> “Biến điểm cắt thành Miệng Hổ — địch bước vào là mất xác!”</div>
      `,
      demoInitialPosition: {
        black: [[3, 3], [4, 4]],
        white: [[2, 3], [3, 4], [5, 4]]
      },
      demoSteps: [
        {
          caption: 'Đen có hai quân đứng chéo D6 và E5. Nếu đánh E6 sẽ nối được nhưng hơi chật chội.'
        },
        {
          moves: [{ x: 5, y: 3, color: BLACK }],
          caption: 'Đen đánh F6 tạo hình Miệng Hổ hướng về E6!'
        },
        {
          moves: [{ x: 4, y: 3, color: WHITE }, { x: 4, y: 2, color: BLACK }],
          caption: 'Nếu Trắng liều lĩnh cắt vào E6, Trắng chỉ còn 1 khí ở E7 và bị Đen ăn gọn ngay lập tức!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Hãy đánh nước Miệng Hổ (F6) để bảo vệ điểm cắt mà không tạo Tam Giác Rỗng, rồi ăn gọn quân Trắng nếu Trắng dám cắt!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 3], [4, 4]],
          white: [[2, 3], [3, 4], [5, 4]]
        },
        hint: {
          text: 'Đánh vào F6 để tạo hình chữ V (Miệng Hổ) bao quanh E6.',
          marker: { x: 5, y: 3, type: 'circle' }
        },
        tree: {
          '5,3': {
            status: 'continue',
            reply: [4, 3],
            feedback: 'Tuyệt vời! Trắng thử cắt vào E6 nhưng đã rơi thẳng vào Miệng Hổ! Hãy đóng hàm bắt gọn quân E6 tại E7!',
            next: {
              '4,2': {
                status: 'solved',
                feedback: 'Hoàn hảo! Bạn vừa tạo hình Miệng Hổ đẹp mắt, vừa bắt gọn quân cắt của Trắng!'
              }
            }
          },
          '4,3': {
            status: 'wrong',
            reply: [4, 2],
            feedback: 'Nối ở E6 tạo thành Tam Giác Rỗng nặng nề và bị Trắng ép từ E7!'
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tạo hình Miệng Hổ tại F6 để giăng bẫy điểm cắt E6.'
      }
    },

    // ==================== STAGE 5 ====================
    {
      id: 'lesson-5-1',
      stageId: 'stage-5',
      code: '5.1',
      title: 'Nguyên Tắc Vàng Khai Cuộc (Fuseki)',
      jpTerm: 'Fuseki (Khai Cuộc Toàn Bàn)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      summary: 'Thứ tự vàng trên bàn 19×19: Góc trước → Biên sau → Trung tâm cuối; Đường 3 lấy đất, Đường 4 lấy thế.',
      theoryHtml: `
        <p>Trên bàn chuẩn <strong>19×19</strong> rộng lớn, một quân đặt ở góc dễ vây đất gấp nhiều lần quân ở giữa bàn (vì góc có sẵn 2 cạnh bàn cờ che chở).</p>
        <ul>
          <li><strong>Thứ tự ưu tiên:</strong> <em>1. Chiếm Góc trống</em> → <em>2. Tiếp cận hoặc Bảo vệ Góc</em> → <em>3. Mở rộng ra Biên</em> → <em>4. Phát triển ra Trung tâm</em>.</li>
          <li><strong>Đường 3 (San-sen):</strong> Đường lấy <strong>Đất (Territory)</strong> chắc chắn.</li>
          <li><strong>Đường 4 (Yon-sen):</strong> Đường lấy <strong>Thế lực (Influence)</strong> hướng ra giữa bàn (ví dụ điểm Sao 4-4).</li>
        </ul>
        <div class="proverb-box">💡 <strong>Tam Đại Nguyên Tắc:</strong> “Góc là vàng, biên là bạc, giữa bàn chỉ là cỏ dại (khi mới khai cuộc).”</div>
      `,
      demoInitialPosition: {
        black: [],
        white: []
      },
      demoSteps: [
        {
          caption: 'Bàn cờ 19×19 có 9 Điểm Sao (Hoshi). 4 Điểm Sao ở góc (4-4) là vị trí khai cuộc cân bằng phổ biến nhất.'
        },
        {
          moves: [
            { x: 15, y: 3, color: BLACK },
            { x: 3, y: 3, color: WHITE },
            { x: 15, y: 15, color: BLACK },
            { x: 3, y: 15, color: WHITE }
          ],
          caption: 'Hai bên lần lượt chiếm hết 4 góc trước tiên trước khi tiến ra biên!'
        },
        {
          moves: [{ x: 13, y: 2, color: BLACK }],
          caption: 'Khi 4 góc đã có chủ, bắt đầu nước Tiếp Cận Góc (Kakari) hoặc mở rộng dọc theo biên (như O17).'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Nước thứ 4 trong Khai cuộc 19×19): Góc dưới phải vẫn còn trống hoàn toàn! Hãy chiếm điểm Sao (4-4) hoặc Tiểu Mục (3-4) ở góc dưới phải.',
        playerColor: BLACK,
        initialPosition: {
          black: [[15, 3]],
          white: [[3, 3], [3, 15]]
        },
        hint: {
          text: 'Hãy nhìn vào Điểm Sao ở góc dưới phải (Q4)!',
          marker: { x: 15, y: 15, type: 'circle' }
        },
        tree: {
          '15,15': {
            status: 'solved',
            feedback: 'Chính xác! Chiếm góc trống Q4 (4-4) là nước khai cuộc lớn nhất trên bàn cờ, tuân thủ đúng nguyên tắc “Góc trước, Biên sau”.'
          },
          '16,15': {
            status: 'solved',
            feedback: 'Tuyệt vời! R4 (3-4 Tiểu Mục) cũng là nước chiếm góc chắc đất cực kỳ chuẩn mực.'
          },
          '15,16': {
            status: 'solved',
            feedback: 'Tuyệt vời! Q3 (4-3 Tiểu Mục) cũng là nước chiếm góc rất hay trong khai cuộc.'
          }
        },
        defaultWrongFeedback: 'Chưa tối ưu! Trong khai cuộc khi vẫn còn góc trống, góc dưới phải (Q4 / R4 / Q3) luôn giá trị hơn đi ở biên hay giữa bàn.'
      }
    },
    {
      id: 'lesson-5-2',
      stageId: 'stage-5',
      code: '5.2',
      title: 'Định Thức: Xâm Nhập Tam Tam (3-3)',
      jpTerm: 'San-san Joseki (Định thức 3-3)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      cropRect: { minX: 9, maxX: 18, minY: 0, maxY: 9 },
      summary: 'Định thức nổi tiếng nhất thời đại AI: Trắng xâm nhập 3-3 để lấy đất góc, Đen chặn ngoài để lấy tường dày.',
      theoryHtml: `
        <p><strong>Định thức (Joseki)</strong> là chuỗi nước đi tiêu chuẩn ở góc mang lại kết quả cân bằng cho cả hai bên. Khi Đen có quân ở điểm Sao (4-4) <code>Q16</code>, Trắng thường xâm nhập ngay vào điểm <strong>3-3 (Tam Tam - R17)</strong>:</p>
        <ul>
          <li><strong>Trắng nhận được:</strong> Đất thật an toàn ở góc (~10–12 điểm).</li>
          <li><strong>Đen nhận được:</strong> Bức tường dày vững chắc hướng ra ngoài (<em>Atsumi</em>) để tấn công và tạo vùng ảnh hưởng lớn.</li>
          <li><strong>Nguyên tắc chặn:</strong> Khi bị xâm nhập 3-3, Đen chặn về phía bạn muốn phát triển tường (hoặc phía mạnh hơn của đối thủ để hạn chế họ).</li>
        </ul>
        <div class="proverb-box">💡 <strong>AI Hiện đại:</strong> Đừng sợ bị xâm nhập 3-3! Hãy vui vẻ lấy tường ngoài cực mạnh để làm chủ toàn bàn.</div>
      `,
      demoInitialPosition: {
        black: [[15, 3]],
        white: [[16, 2]]
      },
      demoSteps: [
        {
          caption: 'Đen đang giữ điểm Sao Q16 (4-4), Trắng bất ngờ xâm nhập điểm 3-3 tại R17!'
        },
        {
          moves: [{ x: 15, y: 2, color: BLACK }, { x: 16, y: 3, color: WHITE }],
          caption: 'Đen chặn ở Q17 (bảo vệ phía trên); Trắng nối dài xuống R16.'
        },
        {
          moves: [{ x: 15, y: 4, color: BLACK }, { x: 16, y: 4, color: WHITE }, { x: 15, y: 5, color: BLACK }],
          caption: 'Đen tiếp tục nối dài xây tường Q15 → Trắng R15 → Đen Q14 (lấy bức tường 4 quân cực mạnh).'
        },
        {
          moves: [{ x: 14, y: 2, color: WHITE }, { x: 14, y: 3, color: BLACK }],
          caption: 'Trắng bẻ góc P17 để lấy đất sống trong góc; Đen nối chắc P16 hoàn tất bức tường!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Trắng vừa xâm nhập 3-3 (R17). Hãy thực hiện đúng trình tự Định thức Tam Tam (chặn Q17 → nối Q15 → nối Q14 → chặn P16)!',
        playerColor: BLACK,
        initialPosition: {
          black: [[15, 3]],
          white: [[16, 2]]
        },
        hint: {
          text: 'Bước đầu tiên luôn là chặn ngay sát R17 theo chiều cạnh bạn muốn giữ (Q17).',
          marker: { x: 15, y: 2, type: 'circle' }
        },
        tree: {
          '15,2': {
            status: 'continue',
            reply: [16, 3],
            feedback: 'Đúng! Trắng nối xuống R16. Hãy tiếp tục nối dài bức tường xuống Q15!',
            next: {
              '15,4': {
                status: 'continue',
                reply: [16, 4],
                feedback: 'Chuẩn! Trắng bò tiếp R15. Đen kéo dài thêm 1 bước nữa xuống Q14!',
                next: {
                  '15,5': {
                    status: 'continue',
                    reply: [14, 2],
                    feedback: 'Trắng bẻ P17 để sống góc. Hãy đánh P16 để khóa chặt bức tường ngoài!',
                    next: {
                      '14,3': {
                        status: 'solved',
                        feedback: 'Xuất sắc! Bạn đã hoàn thành trọn vẹn Định thức Tam Tam hiện đại: Trắng sống góc, Đen lấy bức tường ngoài tuyệt đẹp!'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        defaultWrongFeedback: 'Chưa đúng nhịp Định thức Tam Tam! Hãy đi theo thứ tự: Q17 → Q15 → Q14 → P16.'
      }
    },
    {
      id: 'lesson-5-3',
      stageId: 'stage-5',
      code: '5.3',
      title: 'Định Thức: Tiếp Cận Mã (Kakari)',
      jpTerm: 'Keima Kakari & Uke (Tiếp cận & Đỡ góc)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      cropRect: { minX: 8, maxX: 18, minY: 0, maxY: 10 },
      summary: 'Khi đối thủ tiếp cận điểm Sao bằng nước Mã (Kakari), nước đỡ Keima bảo vệ góc là lựa chọn hòa bình và chuẩn xác.',
      theoryHtml: `
        <p>Khi Đen đứng ở Điểm Sao <code>Q16</code> và Trắng đi nước <strong>Tiếp Cận Mã (O17)</strong> để thử thách góc:</p>
        <ul>
          <li><strong>Đỡ góc bằng nước Mã (Keima - R14):</strong> Bảo vệ chắc chắn vùng đất góc (~12 điểm) và vẫn giữ thế vững chắc. Sau đó Trắng thường nhảy cách 2 ô dọc biên trên (<code>M17</code>) để ổn định quân.</li>
          <li><strong>Các lựa chọn khác:</strong> Nếu Đen muốn chiến đấu hoặc biên trên quan trọng hơn, Đen có thể kẹp (Pincer) hoặc nhảy 1 ô (<code>Q14</code>).</li>
        </ul>
        <div class="proverb-box">💡 <strong>Nguyên tắc:</strong> Đừng vội lao vào đụng chạm vô cớ — nước đỡ Mã R14 vừa nhẹ nhàng vừa giữ góc chắc chắn.</div>
      `,
      demoInitialPosition: {
        black: [[15, 3]],
        white: [[13, 2]]
      },
      demoSteps: [
        {
          caption: 'Trắng tiếp cận góc Sao của Đen bằng nước Mã O17 (Kakari).'
        },
        {
          moves: [{ x: 16, y: 5, color: BLACK }],
          caption: 'Đen đỡ góc bình tĩnh bằng nước Mã R14 (Keima) — giữ chắc vùng đất bên phải góc.'
        },
        {
          moves: [{ x: 11, y: 2, color: WHITE }],
          caption: 'Trắng mở rộng 2 ô sang trái tại M17 để tạo căn cứ sống ổn định — kết thúc một Định thức hòa bình!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Trắng vừa tiếp cận góc Sao bằng nước Mã (O17). Hãy đi nước đỡ góc hình Mã (Keima) ở cạnh phải để giữ đất góc!',
        playerColor: BLACK,
        initialPosition: {
          black: [[15, 3]],
          white: [[13, 2]]
        },
        hint: {
          text: 'Từ Q16 đi xuống 2 ô, sang phải 1 ô — đó là giao điểm R14!',
          marker: { x: 16, y: 5, type: 'circle' }
        },
        tree: {
          '16,5': {
            status: 'continue',
            reply: [11, 2],
            feedback: 'Chính xác! Trắng mở rộng sang M17, kết thúc một Định thức khai cuộc cân bằng tuyệt đẹp.',
            next: {}
          }
        },
        defaultWrongFeedback: 'Chưa đúng! Hãy tìm nước đỡ hình Mã (Keima) từ Q16 xuống cạnh phải tại R14.'
      }
    },

    // ==================== STAGE 6 ====================
    {
      id: 'lesson-6-1',
      stageId: 'stage-6',
      code: '6.1',
      title: 'Đả Nhập (Invasion) vs Xâm Lấn (Reduction)',
      jpTerm: 'Uchikomi & Keshi (Đả nhập & Xâm lấn)',
      difficulty: 'Nâng cao',
      boardSize: 19,
      cropRect: { minX: 6, maxX: 18, minY: 0, maxY: 13 },
      summary: 'Khi đối thủ dựng khung đất quá rộng (Moyo), biết khi nào nên Xâm Lấn từ trên (Đánh Vai) thay vì Đả Nhập sâu chịu chết.',
      theoryHtml: `
        <p>Sai lầm phổ biến nhất ở trình độ trung cấp là thấy khung đất (Moyo) của đối thủ to quá liền nhảy sâu vào đường 2–3 để <strong>Đả Nhập (Invasion)</strong> — kết quả là bị vây đánh tả tơi và chết sạch!</p>
        <ul>
          <li><strong>Khi đối phương dày đặc xung quanh:</strong> Hãy chọn <strong>Xâm Lấn (Reduction)</strong> từ đường 5 (ví dụ <em>Đánh Vai / Katatsuki</em>) để thu hẹp đất của địch một cách an toàn và giữ tiên thủ hướng ra trung tâm.</li>
          <li><strong>Khi đối phương còn hở nhiều khoảng trống:</strong> Mới cân nhắc <strong>Đả Nhập</strong> ở đường 3 để sống bên trong.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Chiến lược cao cấp:</strong> “Đừng cho địch xây thành, cũng đừng nhảy vào miệng hổ — Đánh Vai đường 5 xóa Moyo êm như ru!”</div>
      `,
      demoInitialPosition: {
        black: [[3, 3], [3, 15], [9, 15]],
        white: [[15, 3], [15, 9], [15, 15], [9, 3], [13, 15]]
      },
      demoSteps: [
        {
          caption: 'Trắng đang tạo một Khung Đất (Moyo) khổng lồ dọc toàn bộ biên phải (Q16 – Q10 – Q4) và có quân hỗ trợ vững chắc.'
        },
        {
          moves: [{ x: 14, y: 9, color: BLACK }],
          caption: 'Đen dùng nước Đánh Vai (Katatsuki) tại P10 (đường 5, chéo sát Q10)! Nước này xóa tan ý đồ biến trung tâm thành đất của Trắng mà Đen vẫn hoàn toàn an toàn.'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước: Trắng có tường biên phải cực mạnh (Q16-Q10-Q4). Thay vì nhảy sâu đường 2–3 dễ bị vây chết, hãy đánh nước Xâm Lấn “Đánh Vai” (Katatsuki) chuẩn xác!',
        playerColor: BLACK,
        initialPosition: {
          black: [[3, 3], [3, 15], [9, 15]],
          white: [[15, 3], [15, 9], [15, 15], [9, 3], [13, 15]]
        },
        hint: {
          text: 'Hãy đánh chéo sát vào vai của quân Trắng ở giữa biên phải Q10 — giao điểm P10!',
          marker: { x: 14, y: 9, type: 'circle' }
        },
        tree: {
          '14,9': {
            status: 'solved',
            feedback: 'Tuyệt vời! Nước Đánh Vai P10 vừa phá vỡ tham vọng Moyo ở giữa của Trắng, vừa đảm bảo an toàn tuyệt đối cho quân Đen!'
          },
          '14,6': {
            status: 'solved',
            feedback: 'Rất tốt! Xâm lấn trên đường 5 tại P13 cũng là một lựa chọn nhẹ nhàng và an toàn để thu hẹp khung đất Trắng.'
          },
          '16,6': {
            status: 'wrong',
            reply: [14, 6],
            feedback: 'Quá sâu (đường 3)! Trắng chỉ cần chụp mũ từ P13 là quân R13 của bạn bị kẹp giữa Q16 và Q10, cực kỳ nguy hiểm!'
          }
        },
        defaultWrongFeedback: 'Chưa chuẩn chiến lược! Hãy dùng đòn Đánh Vai trên đường 5 (P10) để Xâm Lấn êm ái khung đất Trắng.'
      }
    },
    {
      id: 'lesson-6-2',
      stageId: 'stage-6',
      code: '6.2',
      title: 'Thu Quan (Yose): Tiên Thủ & Hầu Khiêu',
      jpTerm: 'Yose & Sarusuberi (Thu Quan & Hầu Khiêu)',
      difficulty: 'Nâng cao',
      boardSize: 9,
      summary: 'Đánh giá Tiên Thủ (Sente) – Hậu Thủ (Gote) và thực hiện đòn Hầu Khiêu (Monkey Jump) rút đất biên cực mạnh ở cuối ván.',
      theoryHtml: `
        <p>Ở giai đoạn <strong>Thu Quan (Yose)</strong>, thắng thua thường chỉ cách nhau 1–2 điểm. Thứ tự đánh luôn là: <strong>Song Tiên Thủ → Tiên Thủ → Hậu Thủ lớn</strong>.</p>
        <ul>
          <li><strong>Tiên Thủ (Sente):</strong> Nước đi buộc đối phương phải đỡ ngay, giúp bạn giữ quyền chủ động đánh chỗ khác tiếp.</li>
          <li><strong>Hầu Khiêu (Monkey Jump):</strong> Nước nhảy hình Mã từ đường 2 lao xuống đường 1 (như khỉ chuyền cành) để gặm sâu vào đất biên của đối thủ khi có đồng đội chống lưng ở đường 2.</li>
        </ul>
        <div class="proverb-box">💡 <strong>Thu quan:</strong> “Ai giữ được Tiên Thủ ở cuối ván sẽ luôn là người chiến thắng.”</div>
      `,
      demoInitialPosition: {
        black: [[5, 1], [5, 2], [6, 2], [6, 1]],
        white: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 2], [3, 2], [4, 2]]
      },
      demoSteps: [
        {
          caption: 'Giai đoạn Thu Quan: Nếu Đen chỉ đẩy hiền lành vào E8, Trắng chặn D8 và giữ gần hết biên trên.'
        },
        {
          moves: [{ x: 3, y: 0, color: BLACK }],
          caption: 'Đen tung đòn Hầu Khiêu (Monkey Jump) xuống D9 (đường 1, nhảy hình Mã từ F8)!'
        },
        {
          moves: [{ x: 2, y: 1, color: WHITE }, { x: 4, y: 1, color: BLACK }],
          caption: 'Trắng buộc phải chặn ở C8 để giữ góc, Đen nối gọn E8 → gặm được rất nhiều điểm đất của Trắng!'
        }
      ],
      puzzle: {
        prompt: 'Đen đi trước (Thu quan): Hãy thực hiện đòn Hầu Khiêu (Monkey Jump) từ quân F8 để rút tối đa đất biên trên của Trắng!',
        playerColor: BLACK,
        initialPosition: {
          black: [[5, 1], [5, 2], [6, 2], [6, 1]],
          white: [[0, 1], [0, 2], [1, 1], [1, 2], [2, 2], [3, 2], [4, 2]]
        },
        hint: {
          text: 'Nhảy hình Mã từ F8 sang trái 2 ô, lên đường 1 — đó là giao điểm D9!',
          marker: { x: 3, y: 0, type: 'circle' }
        },
        tree: {
          '3,0': {
            status: 'continue',
            reply: [2, 1],
            feedback: 'Đúng chuẩn Hầu Khiêu! Trắng phải chặn góc tại C8. Giờ hãy nối về tại E8 để giữ sạch đất vừa rút được!',
            next: {
              '4,1': {
                status: 'solved',
                feedback: 'Xuất sắc! Đen đã dùng Hầu Khiêu gặm sâu vào vùng biên Trắng một cách an toàn và chính xác!'
              }
            }
          },
          '4,1': {
            status: 'wrong',
            reply: [3, 1],
            feedback: 'Đẩy E8 quá hiền! Trắng chặn ngay D8 và giữ vững toàn bộ đất biên trên bên trái.'
          }
        },
        defaultWrongFeedback: 'Chưa tối ưu! Hãy tung đòn Hầu Khiêu hình Mã xuống đường 1 tại D9 để thu quan tối đa.'
      }
    }
  ];

  // Clean fix for Lesson 2.6 (verified Semeai) and Lesson 5.3 (1-move solved cleanly after reply)
  const l26 = LESSONS.find((l) => l.id === 'lesson-2-6');
  l26.demoInitialPosition = {
    black: [[0, 1], [1, 1], [1, 2], [0, 3], [1, 3], [2, 3], [3, 2], [4, 1], [4, 0]],
    white: [[0, 2], [0, 3]? [0,2]: [0,2]]
  };
  // Replace with clean Semeai coordinates:
  // B corner: (0,1),(1,1),(1,2) -> liberties (0,0),(1,0)
  // W enclosing: (0,2),(0,3),(1,3),(2,2),(2,1) -> liberties (2,0),(3,1)
  // Outer B wall: (0,4),(1,4),(2,3),(3,2),(4,1),(4,0)
  const semeaiPos = {
    black: [[0, 1], [1, 1], [1, 2], [0, 4], [1, 4], [2, 4], [3, 3], [3, 2], [4, 1], [4, 0]],
    white: [[0, 2], [0, 3], [1, 3], [2, 3], [2, 2], [2, 1]]
  };
  l26.demoInitialPosition = semeaiPos;
  l26.demoSteps = [
    {
      caption: 'Nhóm Đen góc (A8-B8-B7) còn 2 khí (A9, B9). Nhóm 6 quân Trắng bao vây cũng còn đúng 2 khí (C9, D8).'
    },
    {
      moves: [{ x: 2, y: 0, color: BLACK }],
      caption: 'Đen cướp khí ngoài của Trắng từ phía trước tại C9! Nước này vừa thu hẹp Trắng xuống 1 khí (D8), vừa tránh để Trắng mở rộng khí.'
    },
    {
      moves: [{ x: 1, y: 0, color: WHITE }, { x: 3, y: 1, color: BLACK }],
      caption: 'Trắng cố chiếu Đen ở B9 nhưng Đen đánh D8 bắt gọn cả 6 quân Trắng trước một nhịp!'
    }
  ];
  l26.puzzle = {
    prompt: 'Đen đi trước: Đen góc và Trắng mỗi bên đều còn đúng 2 khí. Hãy đánh nước cướp khí ngoài chính xác để thắng cuộc Đua Khí (Semeai)!',
    playerColor: BLACK,
    initialPosition: semeaiPos,
    hint: {
      text: 'Đừng chạy thụ động ở B9 và đừng đánh D8 trước! Hãy tấn công từ phía trước tại C9.',
      marker: { x: 2, y: 0, type: 'circle' }
    },
    tree: {
      '2,0': {
        status: 'continue',
        reply: [1, 0],
        feedback: 'Chính xác! Trắng vùng vẫy chiếu lại ở B9. Giờ hãy đi D8 để ăn trọn 6 quân Trắng!',
        next: {
          '3,1': {
            status: 'solved',
            feedback: 'Tuyệt vời! Bạn đã thắng cuộc Đua Khí trước Trắng đúng 1 nhịp nhờ chọn hướng cướp khí chuẩn xác!'
          }
        }
      },
      '3,1': {
        status: 'wrong',
        reply: [2, 0],
        feedback: 'Sai hướng! Khi bạn đánh D8 trước, Trắng đi C9 và tự tăng thêm được khí (B9 và D9) → Trắng thắng cuộc đua!'
      },
      '1,0': {
        status: 'wrong',
        reply: [2, 0],
        feedback: 'Chạy thụ động B9 không giúp Đen tăng thêm khí! Trắng chiếm C9 và đẩy Đen xuống còn 1 khí → Đen thua!'
      }
    },
    defaultWrongFeedback: 'Chưa đúng! Trong Đua Khí, phải cướp khí ngoài của địch từ phía C9.'
  };

  // Fix 5.3 leaf status to 'solved' directly on R14 with opponent reply annotation? Wait: engine/runner handles 'solved' immediately; let's make 5.3 show W reply in feedback or 2-step!
  const l53 = LESSONS.find((l) => l.id === 'lesson-5-3');
  l53.puzzle.tree = {
    '16,5': {
      status: 'solved',
      feedback: 'Chính xác! Nước đỡ hình Mã R14 (Keima) giữ chắc đất góc một cách nhẹ nhàng. Sau đó Trắng thường mở rộng ra M17 để cân bằng hai bên.'
    },
    '15,5': {
      status: 'solved',
      feedback: 'Tốt! Nhảy 1 ô Q14 (Ikken Tobi) cũng là nước bảo vệ góc vững chắc và hướng ra trung tâm.'
    }
  };

  const GLOSSARY = [
    { term: 'Khí (Liberties)', jp: 'Kokyu / Dame', category: 'Luật chơi', lessonId: 'lesson-1-1', desc: 'Các giao điểm trống liền kề theo chiều ngang/dọc quanh một quân hoặc nhóm quân. Hết khí là bị bắt.' },
    { term: 'Chiếu bắt (Atari)', jp: 'Atari', category: 'Luật chơi', lessonId: 'lesson-1-2', desc: 'Tình trạng một quân hoặc nhóm quân chỉ còn đúng 1 khí duy nhất và có thể bị bắt ở nước sau.' },
    { term: 'Tù binh (Prisoners)', jp: 'Agehama', category: 'Luật chơi', lessonId: 'lesson-1-2', desc: 'Quân đối phương bị ăn và nhấc ra khỏi bàn cờ; mỗi tù binh cộng 1 điểm khi tính thắng thua.' },
    { term: 'Tự sát (Suicide)', jp: 'Jisatsu', category: 'Luật chơi', lessonId: 'lesson-1-4', desc: 'Đặt quân vào ô khiến nhóm mình còn 0 khí. Bị cấm theo luật, trừ khi nước đó bắt được quân địch.' },
    { term: 'Cướp / Đạo (Ko)', jp: 'Ko', category: 'Luật chơi', lessonId: 'lesson-1-4', desc: 'Thế ăn qua ăn lại lặp nguyên trạng bàn cờ. Người vừa bị ăn không được ăn trả ngay lập tức mà phải đi 1 nước đòi cướp.' },
    { term: 'Đòi cướp (Ko Threat)', jp: 'Ko-date', category: 'Luật chơi', lessonId: 'lesson-1-4', desc: 'Nước đe dọa ở khu vực khác đủ lớn để ép đối phương đỡ, qua đó mở khóa để quay lại ăn Cướp.' },
    { term: 'Bỏ lượt (Pass)', jp: 'Pass', category: 'Luật chơi', lessonId: 'lesson-1-1', desc: 'Nhường lượt khi thấy không còn nước có lợi. Hai bên Pass liên tiếp sẽ kết thúc ván để đếm điểm.' },
    { term: 'Điểm chấp (Komi)', jp: 'Komi', category: 'Luật chơi', lessonId: 'lesson-5-1', desc: 'Số điểm cộng bù cho quân Trắng vì Đen được quyền đi trước (thường là 6.5 điểm, tránh hòa).' },
    { term: 'Điểm Sao (Star Point)', jp: 'Hoshi', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-5-1', desc: 'Các chấm tròn đánh dấu trên bàn cờ; vị trí 4-4 ở 4 góc là điểm khai cuộc cân bằng phổ biến nhất.' },
    { term: 'Thiên Nguyên (Tengen)', jp: 'Tengen', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-5-1', desc: 'Điểm Sao nằm chính giữa tâm bàn cờ.' },
    { term: 'Nối dài (Extend)', jp: 'Nobi', category: 'Chiến thuật', lessonId: 'lesson-1-3', desc: 'Đánh liền kề thẳng hàng để mở rộng khí hoặc chạy trốn khi bị ép.' },
    { term: 'Nối (Connect)', jp: 'Tsugi', category: 'Chiến thuật', lessonId: 'lesson-2-1', desc: 'Đặt quân nối hai nhóm quân lại thành một thể thống nhất dùng chung khí.' },
    { term: 'Cắt (Cut)', jp: 'Kiri', category: 'Chiến thuật', lessonId: 'lesson-2-1', desc: 'Chen vào giữa để chia rẽ quân đối phương thành hai nhóm yếu cô lập.' },
    { term: 'Song Chiếu (Double Atari)', jp: 'Ryoatari', category: 'Chiến thuật', lessonId: 'lesson-2-2', desc: 'Một nước đánh đồng thời đặt hai nhóm quân địch vào trạng thái Atari cùng lúc.' },
    { term: 'Cầu Thang / Chinh (Ladder)', jp: 'Shicho', category: 'Chiến thuật', lessonId: 'lesson-2-3', desc: 'Chuỗi Atari zig-zag liên hoàn dồn quân địch chạy thẳng vào cạnh bàn cờ để ăn trọn.' },
    { term: 'Thế Lưới / Già (Net)', jp: 'Geta', category: 'Chiến thuật', lessonId: 'lesson-2-4', desc: 'Vây bắt quân địch bằng cách đánh đón đầu từ xa thay vì chạm sát.' },
    { term: 'Hồi Mã Thương (Snapback)', jp: 'Uttegaeshi', category: 'Chiến thuật', lessonId: 'lesson-2-5', desc: 'Thí 1 quân để ép đối thủ ăn và tự đẩy mình vào thế 1 khí rồi ăn ngược lại toàn bộ.' },
    { term: 'Đua Khí (Capturing Race)', jp: 'Semeai', category: 'Chiến thuật', lessonId: 'lesson-2-6', desc: 'Cuộc chạy đua đếm và cướp khí giữa hai nhóm quân chưa sống cùng bị vây sát nhau.' },
    { term: 'Mắt (Eye)', jp: 'Me', category: 'Sống & Chết', lessonId: 'lesson-3-1', desc: 'Giao điểm trống bên trong được quân mình bao bọc an toàn. Hai mắt riêng biệt giúp nhóm quân sống bất tử.' },
    { term: 'Mắt Giả (False Eye)', jp: 'Kakeme', category: 'Sống & Chết', lessonId: 'lesson-3-2', desc: 'Ô trông giống mắt nhưng có ô chéo bị địch kiểm soát khiến tường bao bị tách rời, có thể bị ép lấp lại.' },
    { term: 'Yếu Điểm (Vital Point)', jp: 'Kyusho', category: 'Sống & Chết', lessonId: 'lesson-3-3', desc: 'Giao điểm then chốt quyết định sống-chết của một hình cờ (ví dụ điểm giữa Tam Trực).' },
    { term: 'Phá Mắt (Nakade)', jp: 'Nakade', category: 'Sống & Chết', lessonId: 'lesson-3-4', desc: 'Đặt quân chết vào điểm giữa không gian của đối thủ để khiến họ chỉ tạo được 1 mắt.' },
    { term: 'Song Sống (Seki)', jp: 'Seki', category: 'Sống & Chết', lessonId: 'lesson-3-5', desc: 'Thế bế tắc mà cả hai nhóm quân đều sống vì bên nào đánh vào khí chung trước cũng tự sát.' },
    { term: 'Cờ Thế Sống Chết (Tsumego)', jp: 'Tsumego', category: 'Sống & Chết', lessonId: 'lesson-3-1', desc: 'Bài tập rèn luyện khả năng đọc nước đi và phán đoán sống chết của một khu vực.' },
    { term: 'Nối Tre (Bamboo Joint)', jp: 'Takefu', category: 'Hình cờ', lessonId: 'lesson-4-1', desc: 'Hai cặp quân song song tạo thành hình ống tre rất dẻo dai và tuyệt đối không thể cắt.' },
    { term: 'Tam Giác Rỗng (Empty Triangle)', jp: 'Aki Sankaku', category: 'Hình cờ', lessonId: 'lesson-4-1', desc: 'Ba quân xếp thành chữ L quanh một ô trống — hình cờ nặng nề, kém hiệu quả cần tránh.' },
    { term: 'Bẻ (Hane)', jp: 'Hane', category: 'Hình cờ', lessonId: 'lesson-4-2', desc: 'Nước đánh chéo ôm lấy đầu quân đối phương để hạn chế khí và mở rộng không gian.' },
    { term: 'Thủ Cân (Tesuji)', jp: 'Tesuji', category: 'Hình cờ', lessonId: 'lesson-4-3', desc: 'Nước cờ tinh diệu, hiệu quả nhất trong một tình huống chiến thuật cục bộ.' },
    { term: 'Miệng Hổ (Tiger’s Mouth)', jp: 'Kake-tsugi', category: 'Hình cờ', lessonId: 'lesson-4-4', desc: 'Hình 3 quân chữ V hướng vào một giao điểm; đối thủ đi vào sẽ bị ăn ngay lập tức.' },
    { term: 'Khai Cuộc (Fuseki)', jp: 'Fuseki', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-5-1', desc: 'Giai đoạn đầu ván đấu: chiếm góc, mở rộng ra biên và định hình thế trận toàn bàn.' },
    { term: 'Định Thức (Joseki)', jp: 'Joseki', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-5-2', desc: 'Chuỗi nước đi tiêu chuẩn ở góc mang lại lợi ích cân bằng cho cả hai bên.' },
    { term: 'Tiếp Cận Góc (Approach)', jp: 'Kakari', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-5-3', desc: 'Nước đánh áp sát góc đối phương để thăm dò hoặc hạn chế vùng đất góc của họ.' },
    { term: 'Đả Nhập & Xâm Lấn', jp: 'Uchikomi & Keshi', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-6-1', desc: 'Đả nhập là nhảy sâu vào sống trong vùng đất địch; Xâm lấn là ép từ bên ngoài để thu hẹp.' },
    { term: 'Độ Dày (Thickness)', jp: 'Atsumi', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-5-2', desc: 'Bức tường quân cực kỳ vững chắc hướng ra trung tâm, giúp tấn công và gây sức ép lớn.' },
    { term: 'Tiên Thủ & Hậu Thủ', jp: 'Sente & Gote', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-6-2', desc: 'Tiên thủ là giữ quyền đi trước chủ động; Hậu thủ là phải đỡ nước cuối và nhường lượt cho địch.' },
    { term: 'Thu Quan & Hầu Khiêu', jp: 'Yose & Sarusuberi', category: 'Khai cuộc & Thu quan', lessonId: 'lesson-6-2', desc: 'Giai đoạn cuối ván chốt biên giới đất; Hầu Khiêu là đòn nhảy Mã xuống đường 1 cực hiệu quả.' }
  ];

  const exportsObj = {
    ROADMAP_STAGES,
    LESSONS,
    GLOSSARY
  };

  root.GoAcademy = root.GoAcademy || {};
  Object.assign(root.GoAcademy, exportsObj);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  }
})(typeof window !== 'undefined' ? window : globalThis);
