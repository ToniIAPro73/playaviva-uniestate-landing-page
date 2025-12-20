#!/usr/bin/env python3
"""
Azure Bay Residences Migration Script
Safe Find & Replace operations for Naming & Location conversion

Operations:
- Op1: Hero title & structured data (✅ DONE via commit 12903822)
- Op2: Location tag genericization
- Op3: Price adjustments
- Op4: Currency formatting
- Op5: Meta tags & SEO
"""

import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple


class AzureBayMigration:
    """
    Handles safe migration from Playa Viva to Azure Bay Residences.
    Each operation is tracked with line numbers and validation.
    """

    # Transformation rules: (search_pattern, replacement, operation_name, scope)
    TRANSFORMATIONS = [
        # ========== OPERATION 2: Location Genericization ==========
        # Wynn Effect section
        (
            r"El Wynn Resort & Casino de \$5\.1 mil millones será el primer casino en la historia de los EAU\.",
            "El futuro resort de clase mundial de $5.1 mil millones será un polo de atracción turística y residencial.",
            "Op2_es_wynn_description",
            "content.es.wynnEffect.description"
        ),
        (
            r"Su apertura en 2027 está catalizando una revalorización histórica en Al Marjan Island\.",
            "Su apertura en 2027 está catalizando una revalorización histórica en la comunidad costera premium.",
            "Op2_es_wynn_appreciation",
            "content.es.wynnEffect.description"
        ),
        # Gallery section
        (
            r"Diseño arquitectónico excepcional en Al Marjan Island",
            "Diseño arquitectónico excepcional en comunidad costera premium",
            "Op2_es_gallery_subtitle",
            "content.es.gallery.subtitle"
        ),
        # Location section title
        (
            r"Ubicación: AL MARJAN ISLAND, RAS AL KHAIMAH",
            "Ubicación: COMUNIDAD COSTERA PREMIUM",
            "Op2_es_location_title",
            "content.es.location.title"
        ),
        # English versions
        (
            r"The \$5\.1 billion world-class resort will be a tourism and residential draw\.",
            "The $5.1 billion world-class resort will be a tourism and residential draw.",
            "Op2_en_wynn_description",
            "content.en.wynnEffect.description"
        ),
        (
            r"Its 2027 opening is catalyzing historic appreciation in the premium coastal community\.",
            "Its 2027 opening is catalyzing historic appreciation in the premium coastal community.",
            "Op2_en_wynn_appreciation",
            "content.en.wynnEffect.description"
        ),
        # ========== OPERATION 3: Price Adjustments ==========
        # Spanish prices
        (
            r'price: "Desde 170\.000€"',
            'price: "Desde €170.000"',
            "Op3_es_hero_price_format",
            "content.es.hero.price"
        ),
        (
            r'"Desde 170\.000€"',
            '"Desde €170.000"',
            "Op3_es_studio_price",
            "content.es.apartments.tabs.studio"
        ),
        (
            r'price: "Desde 285\.000€"',
            'price: "Desde €285.000"',
            "Op3_es_1bed_price",
            "content.es.apartments.tabs.oneBed"
        ),
        (
            r'price: "Desde 450\.000€"',
            'price: "Desde €450.000"',
            "Op3_es_2bed_price",
            "content.es.apartments.tabs.twoBed"
        ),
        (
            r'price: "Desde 650\.000€"',
            'price: "Desde €650.000"',
            "Op3_es_3bed_price",
            "content.es.apartments.tabs.threeBed"
        ),
        # English prices (GBP)
        (
            r'price: "Starting from £150,000"',
            'price: "Starting from £150,000"',
            "Op3_en_hero_price",
            "content.en.hero.price"
        ),
        (
            r'"From £154,800"',
            '"From £154,800"',
            "Op3_en_studio_price",
            "content.en.specifications.units[0]"
        ),
        # ========== OPERATION 4: Currency Formatting ==========
        # Ensure consistent GBP/EUR formatting in all sections
        (
            r'(\d+\.\d+)€',
            r'€\1',
            "Op4_eur_format",
            "all_content"
        ),
        # ========== OPERATION 5: Meta Tags ==========
        # These will be handled separately in metadata files
    ]

    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = None
        self.changes: List[Dict] = []
        self.validation_errors: List[str] = []

    def load_file(self) -> bool:
        """Load the file to be processed."""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.content = f.read()
            print(f"✅ Loaded {self.file_path} ({len(self.content)} bytes)")
            return True
        except Exception as e:
            self.validation_errors.append(f"Failed to load file: {e}")
            return False

    def validate_operation(self, operation: Tuple, original: str) -> Tuple[bool, str]:
        """Validate that a transformation can be applied safely."""
        pattern, replacement, op_name, scope = operation
        
        # Check pattern exists
        matches = list(re.finditer(pattern, original))
        if not matches:
            return False, f"{op_name}: Pattern not found"
        
        # Check for multiple matches (potential risk)
        if len(matches) > 1:
            return False, f"{op_name}: Found {len(matches)} matches (expected 1)"
        
        return True, f"{op_name}: ✅ Ready (1 match found)"

    def validate_all_operations(self) -> bool:
        """Validate all operations before applying any changes."""
        print("\n🔍 Validating all operations...\n")
        all_valid = True
        
        for operation in self.TRANSFORMATIONS:
            is_valid, msg = self.validate_operation(operation, self.content)
            status = "✅" if is_valid else "❌"
            print(f"{status} {msg}")
            
            if not is_valid:
                all_valid = False
                self.validation_errors.append(msg)
        
        return all_valid

    def apply_transformation(self, operation: Tuple) -> bool:
        """Apply a single transformation and record the change."""
        pattern, replacement, op_name, scope = operation
        original_content = self.content
        
        # Apply replacement
        self.content, count = re.subn(pattern, replacement, self.content)
        
        if count > 0:
            self.changes.append({
                'operation': op_name,
                'scope': scope,
                'pattern': pattern[:80] + "..." if len(pattern) > 80 else pattern,
                'matches': count,
            })
            print(f"✅ {op_name}: Applied {count} replacement(s)")
            return True
        else:
            print(f"⚠️ {op_name}: No matches found (skipped)")
            return False

    def apply_all_operations(self) -> bool:
        """Apply all validated operations sequentially."""
        print("\n🚀 Applying transformations...\n")
        
        applied_count = 0
        for operation in self.TRANSFORMATIONS:
            if self.apply_transformation(operation):
                applied_count += 1
        
        print(f"\n📊 Total operations applied: {applied_count}/{len(self.TRANSFORMATIONS)}")
        return applied_count > 0

    def save_file(self, output_path: str = None) -> bool:
        """Save the modified content to file."""
        target_path = Path(output_path) if output_path else self.file_path
        
        try:
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(self.content)
            print(f"\n✅ Saved to {target_path} ({len(self.content)} bytes)")
            return True
        except Exception as e:
            self.validation_errors.append(f"Failed to save file: {e}")
            print(f"❌ Failed to save: {e}")
            return False

    def generate_report(self) -> str:
        """Generate a detailed report of all changes."""
        report = "\n" + "="*80
        report += "\n📋 AZURE BAY MIGRATION REPORT\n"
        report += "="*80 + "\n\n"
        
        report += f"📁 File: {self.file_path}\n"
        report += f"📊 Changes applied: {len(self.changes)}\n\n"
        
        if self.changes:
            report += "✅ SUCCESSFUL TRANSFORMATIONS:\n"
            report += "-"*80 + "\n"
            for i, change in enumerate(self.changes, 1):
                report += f"{i}. {change['operation']} [{change['scope']}]\n"
                report += f"   Matches: {change['matches']}\n"
                report += f"   Pattern: {change['pattern']}\n\n"
        
        if self.validation_errors:
            report += "\n⚠️ VALIDATION ERRORS:\n"
            report += "-"*80 + "\n"
            for error in self.validation_errors:
                report += f"• {error}\n"
        
        report += "\n" + "="*80 + "\n"
        return report


def main():
    """Main execution."""
    if len(sys.argv) < 2:
        print("Usage: python azure-bay-migration.py <file_path> [--dry-run]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    dry_run = '--dry-run' in sys.argv
    
    migrator = AzureBayMigration(file_path)
    
    # Step 1: Load file
    if not migrator.load_file():
        print("\n❌ Failed to load file")
        sys.exit(1)
    
    # Step 2: Validate all operations
    if not migrator.validate_all_operations():
        print("\n❌ Validation failed")
        sys.exit(1)
    
    # Step 3: Apply transformations
    if not migrator.apply_all_operations():
        print("\n❌ No transformations applied")
        sys.exit(1)
    
    # Step 4: Generate and print report
    report = migrator.generate_report()
    print(report)
    
    # Step 5: Save file (unless dry-run)
    if not dry_run:
        if migrator.save_file():
            print("\n✅ Migration complete!")
            sys.exit(0)
        else:
            print("\n❌ Failed to save file")
            sys.exit(1)
    else:
        print("\n🔄 DRY RUN MODE - No changes saved")
        sys.exit(0)


if __name__ == '__main__':
    main()
