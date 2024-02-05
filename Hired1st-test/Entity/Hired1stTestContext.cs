using Hired1stTest.Entity.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hired1stTest.Entity
{
    public partial class Hired1stTestContext : IdentityDbContext<User>
    {
        public Hired1stTestContext(DbContextOptions<Hired1stTestContext> options) : base(options)
        {
        }
        public DbSet<Product> Product { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__PRODUCT__3214EC27D71D6D15");

                entity.Property(e => e.Id)
                    .HasColumnType("INT")
                    .ValueGeneratedOnAdd(); ;
                entity.Property(e => e.Name)
                    .HasColumnType("VARCHAR")
                    .HasMaxLength(255)
                    .IsRequired();
                entity.Property(e => e.Price)
                    .HasColumnType("DECIMAL")
                    .HasPrecision(20, 3)
                    .IsRequired(); ;
                entity.Property(e => e.Description)
                    .HasColumnType("VARCHAR")
                    .HasMaxLength(1000)
                    .IsRequired(); ;
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
