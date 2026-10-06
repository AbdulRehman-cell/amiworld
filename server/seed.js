const mongoose = require('mongoose');

// Define Product schema locally to ensure standalone execution of seed script
const ProductSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true
    },
    discipline: {
      type: String,
      required: [true, 'Discipline (e.g., Hockey, Padel, Gear) is required'],
      enum: ['Hockey', 'Padel', 'Gear'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    currency: {
      type: String,
      default: 'GBP'
    },
    carbonPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    bowType: {
      type: String,
      enum: ['Low Bow', 'Extreme Low Bow', 'Mid Bow', 'Teardrop', 'Diamond', 'Round', 'N/A'],
      default: 'N/A'
    },
    weight: {
      type: String,
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    inventoryCount: {
      type: Number,
      required: true,
      default: 10
    },
    technicalSpecs: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  // --- FIELD HOCKEY sticks ---
  {
    sku: 'AMI-HX100-LB',
    discipline: 'Hockey',
    name: 'Carbon-X 100 Low Bow',
    description: 'The ultimate professional grade field hockey weapon. Crafted with 100% Japanese Toray carbon composite, designed for razor-sharp drag flicking dynamics, supreme rebound velocity, and instant ball-to-hand energy transfer on premium wet turf.',
    price: 310,
    currency: 'GBP',
    carbonPercentage: 100,
    bowType: 'Low Bow',
    weight: '525g - 540g',
    images: [
      'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 24,
    technicalSpecs: [
      { key: 'Material', value: '100% Japanese Toray Carbon' },
      { key: 'Bow Point', value: '24mm bow at 200mm from head' },
      { key: 'Carbon Weave', value: 'Tri-Axial High Tensile' },
      { key: 'Core tech', value: 'Vibe-Cancel Core (VCC)' }
    ]
  },
  {
    sku: 'AMI-HX100-ELB',
    discipline: 'Hockey',
    name: 'Carbon-X 100 Extreme Low Bow',
    description: 'Precision-engineered for drag-flick specialists and dynamic aerial playmakers. Features an aggressive low placement curve to maximize catapult leverage, delivering up to 12% boost in outright ball exit speed.',
    price: 330,
    currency: 'GBP',
    carbonPercentage: 100,
    bowType: 'Extreme Low Bow',
    weight: '520g - 535g',
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 15,
    technicalSpecs: [
      { key: 'Material', value: '100% Toray Aircraft-Grade Carbon' },
      { key: 'Bow Point', value: '25mm bow at 190mm from head' },
      { key: 'Profile', value: 'Dynamic Drag-Flick Channel' },
      { key: 'Grip', value: 'Extreme-Tac Vibration Dampened' }
    ]
  },
  {
    sku: 'AMI-HX90-MB',
    discipline: 'Hockey',
    name: 'Carbon-X 90 Mid Bow',
    description: 'Calibrated for all-pitch control and high-velocity passing distributions. The 90% high-modulus carbon configuration offers optimal stiffness and premium feedback without sacrificing soft-touch close control.',
    price: 270,
    currency: 'GBP',
    carbonPercentage: 90,
    bowType: 'Mid Bow',
    weight: '530g - 545g',
    images: [
      'https://images.unsplash.com/photo-1628891890467-b79f2c879657?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 30,
    technicalSpecs: [
      { key: 'Material', value: '90% Carbon / 10% Kevlar' },
      { key: 'Bow Point', value: '24mm bow at 300mm from head' },
      { key: 'Core tech', value: 'Dual-Chamber Construction' },
      { key: 'Head Profile', value: 'Maxi Head 45° Angle' }
    ]
  },

  // --- PADEL RACKETS ---
  {
    sku: 'AMI-PD-ORBIT18K',
    discipline: 'Padel',
    name: 'Orbit Pro 18K Diamond',
    description: 'An aggressive diamond-shaped masterpiece engineered for high-performance players. The 18K aluminized carbon face delivers explosive rebound speed and unrivaled offensive overhead drive dynamics.',
    price: 280,
    currency: 'GBP',
    carbonPercentage: 100,
    bowType: 'Diamond',
    weight: '365g - 375g',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 18,
    technicalSpecs: [
      { key: 'Surface', value: '18K Aluminized Carbon' },
      { key: 'Frame Geometry', value: 'Dynamic Diamond Shape' },
      { key: 'Core', value: 'High-Density EVA Elastic-Foam' },
      { key: 'Sweet Spot', value: 'High / Power-Optimized' }
    ]
  },
  {
    sku: 'AMI-PD-VORTEX-TD',
    discipline: 'Padel',
    name: 'Orbit Vortex Teardrop',
    description: 'The quintessential hybrid padel weapon. Designed with a teardrop shape that offers a perfect balance of blistering baseline speed and exquisite aerial touch. Features variable-density hole placement to maximize the sweet spot.',
    price: 245,
    currency: 'GBP',
    carbonPercentage: 90,
    bowType: 'Teardrop',
    weight: '360g - 370g',
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 22,
    technicalSpecs: [
      { key: 'Surface', value: '12K Interlocking Carbon' },
      { key: 'Frame Geometry', value: 'Teardrop Balance' },
      { key: 'Core', value: 'Medium Flex EVA Core (38g/dm³)' },
      { key: 'Sweet Spot', value: 'Mid-High / 24% Expanded Matrix' }
    ]
  },

  // --- TACTICAL GEAR & PACKS ---
  {
    sku: 'AMI-GR-BAG85L',
    discipline: 'Gear',
    name: 'AMI Tactical Stickpack 85L',
    description: 'An ultra-rugged transit system designed for elite athletes on the move. Features waterproof ballistic nylon, isolated wet-gear ventilated compartments, and dedicated sleeve systems to secure up to 4 hockey sticks.',
    price: 110,
    currency: 'GBP',
    carbonPercentage: 0,
    bowType: 'N/A',
    weight: '1200g',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 40,
    technicalSpecs: [
      { key: 'Material', value: '1680D Ballistic Waterproof Nylon' },
      { key: 'Capacity', value: '85 Litres Custom Volume' },
      { key: 'Stick Capacity', value: 'Up to 4 Sticks' },
      { key: 'Hardware', value: 'YKK Weather-Proof Zippers' }
    ]
  },
  {
    sku: 'AMI-GR-SHIN-COMP',
    discipline: 'Gear',
    name: 'High-Impact Composite Shinguards',
    description: 'Carbon-reinforced protective guards designed to anatomically contour the shin. Offers ultimate ballistic protection on cold turf pitches with high-density foam backing and dynamic moisture-wicking technology.',
    price: 45,
    currency: 'GBP',
    carbonPercentage: 30,
    bowType: 'N/A',
    weight: '180g each',
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 50,
    technicalSpecs: [
      { key: 'Shell Material', value: '30% Carbon / 70% Polycarbonate Blend' },
      { key: 'Inner Foam', value: 'Dual-Density Shock Absorbing EVA' },
      { key: 'Strapping', value: 'Dynamic Compression Sleeve Included' },
      { key: 'Ventilation', value: 'Integrated Airflow Channels' }
    ]
  },
  {
    sku: 'AMI-GR-TACGRIP',
    discipline: 'Gear',
    name: 'Ultra-Tac Hydrophobic Overgrip x3',
    description: 'Never lose dynamic command of your weapon. Engineered with premium polyurethane elastomer and a traction-inducing micro-texture. Formulated to channel sweat and moisture instantly for complete confidence in extreme playing conditions.',
    price: 18,
    currency: 'GBP',
    carbonPercentage: 0,
    bowType: 'N/A',
    weight: '30g',
    images: [
      'https://images.unsplash.com/photo-1609899537878-39d4a0376044?auto=format&fit=crop&q=80&w=800'
    ],
    inventoryCount: 120,
    technicalSpecs: [
      { key: 'Material', value: 'Polyurethane Elastomer Grid' },
      { key: 'Thickness', value: '1.8mm Precision Calibrated' },
      { key: 'Count', value: '3 Grip Rolls Per Pack' },
      { key: 'Adhesion', value: 'High-Stick Self Adhesive Backing' }
    ]
  }
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amiworld';
  
  console.log('Connecting to database...');
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Successfully connected to MongoDB.');

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Database already contains ${count} products. Skipping seeding.`);
    } else {
      console.log('Database empty. Seeding performance products...');
      const created = await Product.insertMany(sampleProducts);
      console.log(`Successfully seeded ${created.length} AMI high-performance products.`);
    }
  } catch (error) {
    console.error('Critical failure in seeding script:', error);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Disconnected. Seeding runner finished.');
  }
}

seedDatabase();