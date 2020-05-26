using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace FoodAPI.Models.FoodModels
{
    public partial class fooddbContext : DbContext
    {
        public fooddbContext()
        {
        }

        public fooddbContext(DbContextOptions<fooddbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AminoAcids> AminoAcids { get; set; }
        public virtual DbSet<BiogenicAmines> BiogenicAmines { get; set; }
        public virtual DbSet<Carbohydrates> Carbohydrates { get; set; }
        public virtual DbSet<Factors> Factors { get; set; }
        public virtual DbSet<FactorsAndMore> FactorsAndMore { get; set; }
        public virtual DbSet<FattyAcidsSums> FattyAcidsSums { get; set; }
        public virtual DbSet<Foods> Foods { get; set; }
        public virtual DbSet<Macronutrients> Macronutrients { get; set; }
        public virtual DbSet<MineralsAndInorganic> MineralsAndInorganic { get; set; }
        public virtual DbSet<OrganicAcids> OrganicAcids { get; set; }
        public virtual DbSet<Sterols> Sterols { get; set; }
        public virtual DbSet<Vitamins> Vitamins { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseNpgsql("Host=localhost;Database=fooddb;Username=postgres;Password=golo");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.1-servicing-10028");

            modelBuilder.Entity<AminoAcids>(entity =>
            {
                entity.ToTable("amino_acids");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.UnitMgPerGNitrogen).HasColumnName("unit_mg_per_g_nitrogen");

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<BiogenicAmines>(entity =>
            {
                entity.ToTable("biogenic_amines");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<Carbohydrates>(entity =>
            {
                entity.ToTable("carbohydrates");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<Factors>(entity =>
            {
                entity.ToTable("factors");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<FactorsAndMore>(entity =>
            {
                entity.ToTable("factors_and_more");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<FattyAcidsSums>(entity =>
            {
                entity.ToTable("fatty_acids_sums");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.PercentOfTotal).HasColumnName("percent_of_total");

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<Foods>(entity =>
            {
                entity.ToTable("foods");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.NameDk)
                    .IsRequired()
                    .HasColumnName("name_dk")
                    .HasMaxLength(100);

                entity.Property(e => e.NameEng)
                    .HasColumnName("name_eng")
                    .HasMaxLength(100);

                entity.Property(e => e.NameHash).HasColumnName("name_hash");
            });

            modelBuilder.Entity<Macronutrients>(entity =>
            {
                entity.ToTable("macronutrients");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<MineralsAndInorganic>(entity =>
            {
                entity.ToTable("minerals_and_inorganic");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<OrganicAcids>(entity =>
            {
                entity.ToTable("organic_acids");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<Sterols>(entity =>
            {
                entity.ToTable("sterols");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });

            modelBuilder.Entity<Vitamins>(entity =>
            {
                entity.ToTable("vitamins");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FoodId).HasColumnName("food_id");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(10);

                entity.Property(e => e.Value).HasColumnName("value");
            });
        }
    }
}
